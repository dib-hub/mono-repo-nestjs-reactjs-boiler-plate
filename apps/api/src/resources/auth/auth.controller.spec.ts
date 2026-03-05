import { BadRequestException } from '@nestjs/common';
import { IUser, UserRole, NestPassportMockModule } from '@my-monorepo/types';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';
import { SignInDto } from './dto/auth.dto';

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

const mockUser: IUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthServiceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = {
      signup: jest.fn(),
      signIn: jest.fn(),
      getUserById: jest.fn(),
    };
    controller = new AuthController(authService as unknown as AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should delegate to authService.signup and return the new user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      };
      authService.signup.mockResolvedValue(mockUser);

      const result = await controller.signUp(dto);

      expect(result).toBe(mockUser);
      expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('signIn', () => {
    it('should delegate to authService.signIn and return the user', async () => {
      const dto: SignInDto = { email: 'test@example.com', password: 'password123' };
      authService.signIn.mockResolvedValue(mockUser);

      const result = await controller.signIn(dto);

      expect(result).toBe(mockUser);
      expect(authService.signIn).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      authService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1');

      expect(result).toBe(mockUser);
      expect(authService.getUserById).toHaveBeenCalledWith('1');
    });

    it('should propagate BadRequestException when user is not found', async () => {
      authService.getUserById.mockRejectedValue(new BadRequestException('User not found'));

      await expect(controller.getUserById('999')).rejects.toThrow(BadRequestException);
    });
  });
});
