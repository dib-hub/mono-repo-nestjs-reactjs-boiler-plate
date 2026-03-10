// ensure database package (which pulls in Prisma) is mocked before loading AuthService
jest.mock('@my-monorepo/database', () => ({
  UsersService: class {},
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@my-monorepo/types';
import { UsersService } from '@my-monorepo/database';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/user.dto';

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

const mockedBcrypt = bcrypt as unknown as { compare: jest.Mock; hash: jest.Mock };

type UserWithPassword = UserDto & { password: string };

const mockUser: UserDto = {
  id: '1',
  email: 'a@a.com',
  firstName: 'A',
  lastName: 'B',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserWithPassword: UserWithPassword = {
  ...mockUser,
  password: 'hashed',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockJwtService.sign as jest.Mock).mockReturnValue('mock_token');
    service = new AuthService(mockUsersService as unknown as UsersService, mockJwtService as any);
  });

  it('validateUser should return sanitized user when credentials are valid', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
    mockedBcrypt.compare.mockResolvedValue(true);

    await expect(service.validateUser('a@a.com', 'password')).resolves.toEqual(mockUser);
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('a@a.com');
    expect(mockedBcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
  });

  it('validateUser should return null when user not found', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(service.validateUser('a@a.com', 'pw')).resolves.toBeNull();
  });

  it('validateUser should return null when password does not match', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
    mockedBcrypt.compare.mockResolvedValue(false);

    await expect(service.validateUser('a@a.com', 'wrong')).resolves.toBeNull();
  });

  it('signup should throw when email already exists', async () => {
    const dto: CreateUserDto = {
      email: 'a@a.com',
      firstName: 'A',
      lastName: 'B',
      password: 'pw1234',
    };
    mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);

    await expect(service.signup(dto)).rejects.toThrow(BadRequestException);
    expect(mockUsersService.create).not.toHaveBeenCalled();
  });

  it('signup should hash password, create user, and return auth response', async () => {
    const dto: CreateUserDto = { email: 'a@a.com', firstName: 'A', lastName: 'B', password: 'pw' };
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue('hashed-password');
    mockUsersService.create.mockResolvedValue({
      ...mockUser,
      email: 'a@a.com',
      password: 'hashed-password',
    });
    mockJwtService.sign.mockReturnValue('jwt-token');

    await expect(service.signup(dto)).resolves.toEqual({
      user: mockUser,
      accessToken: 'jwt-token',
    });
    expect(mockUsersService.create).toHaveBeenCalledWith({
      email: 'a@a.com',
      firstName: 'A',
      lastName: 'B',
      password: 'hashed-password',
      role: UserRole.USER,
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ email: 'a@a.com', sub: '1' });
  });

  it('signIn should return auth response', async () => {
    mockJwtService.sign.mockReturnValue('jwt-token');

    await expect(service.signIn(mockUser)).resolves.toEqual({
      user: mockUser,
      accessToken: 'jwt-token',
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ email: 'a@a.com', sub: '1' });
  });

  it('signInWithCredentials should return auth response for valid credentials', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
    mockedBcrypt.compare.mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('jwt-token');

    await expect(service.signInWithCredentials('a@a.com', 'password')).resolves.toEqual({
      user: mockUser,
      accessToken: 'jwt-token',
    });
  });

  it('signInWithCredentials should throw UnauthorizedException for invalid credentials', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(service.signInWithCredentials('x@x.com', 'pw')).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('getUserById should return user when found', async () => {
    mockUsersService.findById.mockResolvedValue(mockUserWithPassword);
    await expect(service.getUserById('foo')).resolves.toEqual(mockUser);
  });

  it('getUserById should throw if not found', async () => {
    mockUsersService.findById.mockResolvedValue(null);
    await expect(service.getUserById('foo')).rejects.toThrow(BadRequestException);
  });
});
