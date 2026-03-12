import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IUser, UserRole, NestPassportMockModule } from '@my-monorepo/types';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';
import { GoogleAuthService } from '../../services/google-auth/google-auth.service';

jest.mock('@my-monorepo/database', () => ({
  UsersService: class {},
  UsersModule: class {},
}));

jest.mock(
  '@nestjs/passport',
  (): NestPassportMockModule => ({
    AuthGuard: (_strategy?: string | string[]) => class MockAuthGuard {},
  })
);

interface AuthServiceMock {
  signup: jest.Mock;
  signIn: jest.Mock;
  getUserById: jest.Mock;
}

interface GoogleAuthServiceMock {
  loginWithGoogle: jest.Mock;
}

const mockUser: IUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'jwt-token',
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthServiceMock;
  let googleAuthService: GoogleAuthServiceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = {
      signup: jest.fn(),
      signIn: jest.fn(),
      getUserById: jest.fn(),
    };
    googleAuthService = {
      loginWithGoogle: jest.fn(),
    };
    controller = new AuthController(
      authService as unknown as AuthService,
      googleAuthService as unknown as GoogleAuthService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should delegate to authService.signup and return the auth response', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      };
      authService.signup.mockResolvedValue(mockAuthResponse);

      const result = await controller.signUp(dto);

      expect(result).toBe(mockAuthResponse);
      expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('signIn', () => {
    it('should delegate to authService.signIn using req.user', async () => {
      const req = { user: mockUser };
      authService.signIn.mockResolvedValue(mockAuthResponse);

      const result = await controller.signIn(req);

      expect(result).toBe(mockAuthResponse);
      expect(authService.signIn).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('me', () => {
    it('should return currently authenticated user', async () => {
      const req = { user: { userId: '1', email: 'test@example.com' } };
      authService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.me(req);

      expect(result).toBe(mockUser);
      expect(authService.getUserById).toHaveBeenCalledWith('1');
    });
  });

  describe('googleLogin', () => {
    it('should delegate to googleAuthService.loginWithGoogle', async () => {
      googleAuthService.loginWithGoogle.mockResolvedValue(mockAuthResponse);

      const result = await controller.googleLogin({ idToken: 'google-id-token' });

      expect(result).toBe(mockAuthResponse);
      expect(googleAuthService.loginWithGoogle).toHaveBeenCalledWith('google-id-token');
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const req = { user: { userId: '1', email: 'test@example.com' } };
      authService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1', req);

      expect(result).toBe(mockUser);
      expect(authService.getUserById).toHaveBeenCalledWith('1');
    });

    it('should throw ForbiddenException when requesting another user', async () => {
      const req = { user: { userId: '2', email: 'test@example.com' } };

      await expect(controller.getUserById('1', req)).rejects.toThrow(ForbiddenException);
      expect(authService.getUserById).not.toHaveBeenCalled();
    });

    it('should propagate BadRequestException when user is not found', async () => {
      const req = { user: { userId: '999', email: 'test@example.com' } };
      authService.getUserById.mockRejectedValue(new BadRequestException('User not found'));

      await expect(controller.getUserById('999', req)).rejects.toThrow(BadRequestException);
    });
  });
});
