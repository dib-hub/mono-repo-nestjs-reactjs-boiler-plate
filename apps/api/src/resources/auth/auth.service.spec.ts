// ensure database package (which pulls in Prisma) is mocked before loading AuthService
jest.mock('@my-monorepo/database', () => ({
  UsersService: class {},
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_pw'),
  compare: jest.fn().mockResolvedValue(true),
}));

import { BadRequestException } from '@nestjs/common';
import { IUser, UserRole } from '@my-monorepo/types';
import { UsersService } from '@my-monorepo/database';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';
import { SignInDto } from './dto/auth.dto';

type UsersServiceMock = Partial<UsersService> & {
  create: jest.Mock;
  findByEmail: jest.Mock;
  findById: jest.Mock;
};

const mockUsersService: UsersServiceMock = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockJwtService.sign as jest.Mock).mockReturnValue('mock_token');
    service = new AuthService(mockUsersService as unknown as UsersService, mockJwtService as any);
  });

  it('should signup: hash password, call usersService.create, and return user + token', async () => {
    const dto: CreateUserDto = { email: 'a@a.com', firstName: 'A', lastName: 'B', password: 'pw' };
    const mockUser: IUser = {
      id: '1',
      email: 'a@a.com',
      firstName: 'A',
      lastName: 'B',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsersService.create.mockResolvedValue(mockUser);

    const result = await service.signup(dto);

    expect(result).toEqual({ user: mockUser, accessToken: 'mock_token' });
    expect(mockUsersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: 'hashed_pw',
      })
    );
  });

  it('should signIn: find user, verify password, and return user + token', async () => {
    const dto: SignInDto = { email: '  A@A.COM  ', password: 'pw' };
    const mockUser = {
      id: '1',
      email: 'a@a.com',
      firstName: '',
      lastName: '',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'hashed_pw',
    };
    mockUsersService.findByEmail.mockResolvedValue(mockUser);

    const result = await service.signIn(dto);

    expect(result).toEqual({ user: mockUser, accessToken: 'mock_token' });
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('a@a.com'); // trimmed + lowercased
    expect(bcrypt.compare).toHaveBeenCalledWith('pw', 'hashed_pw');
  });

  it('signIn should throw BadRequestException if user not found', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    await expect(service.signIn({ email: 'x@x.com', password: 'pw' })).rejects.toThrow(
      BadRequestException
    );
  });

  it('signIn should throw BadRequestException if password is invalid', async () => {
    mockUsersService.findByEmail.mockResolvedValue({ id: '1', password: 'hashed_pw' });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    await expect(service.signIn({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(
      BadRequestException
    );
  });

  it('getUserById should return user when found', async () => {
    const user = { id: 'foo', role: UserRole.USER } as IUser;
    mockUsersService.findById.mockResolvedValue(user);
    await expect(service.getUserById('foo')).resolves.toBe(user);
  });

  it('getUserById should throw if not found', async () => {
    mockUsersService.findById.mockResolvedValue(null);
    await expect(service.getUserById('foo')).rejects.toThrow(BadRequestException);
  });

  it('validateUser should return user when credentials are valid', async () => {
    const mockUser = { id: '1', email: 'a@a.com', password: 'hashed_pw' };
    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    const result = await service.validateUser('a@a.com', 'pw');
    expect(result).toBe(mockUser);
  });

  it('validateUser should return null when user not found', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    const result = await service.validateUser('x@x.com', 'pw');
    expect(result).toBeNull();
  });

  it('validateUser should return null when password does not match', async () => {
    mockUsersService.findByEmail.mockResolvedValue({ id: '1', password: 'hashed_pw' });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    const result = await service.validateUser('a@a.com', 'wrong');
    expect(result).toBeNull();
  });
});
