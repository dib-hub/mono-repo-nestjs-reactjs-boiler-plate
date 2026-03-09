// ensure database package (which pulls in Prisma) is mocked before loading AuthService
jest.mock('@my-monorepo/database', () => ({
  UsersService: class {},
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_pw'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { BadRequestException } from '@nestjs/common';
import { IUser, UserRole } from '@my-monorepo/types';
import { UsersService } from '@my-monorepo/database';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';

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

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

type UserWithPassword = IUser & { password: string };

const mockUser: IUser = {
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

<<<<<<< Updated upstream
  it('should signup: hash password, call usersService.create, and return user + token', async () => {
    const dto: CreateUserDto = { email: 'a@a.com', firstName: 'A', lastName: 'B', password: 'pw' };
    const mockUser: IUser = {
      id: '1',
=======
  it('validateUser should return sanitized user when credentials are valid', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
    mockedBcrypt.compare.mockResolvedValue(true);

    await expect(service.validateUser('A@A.com', 'password')).resolves.toEqual(mockUser);
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('a@a.com');
    expect(mockedBcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
  });

  it('validateUser should return null when credentials are invalid', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);
    mockedBcrypt.compare.mockResolvedValue(false);

    await expect(service.validateUser('a@a.com', 'wrong')).resolves.toBeNull();
  });

  it('signup should throw when email already exists', async () => {
    const dto: CreateUserDto = {
>>>>>>> Stashed changes
      email: 'a@a.com',
      firstName: 'A',
      lastName: 'B',
      password: 'pw1234',
    };
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
  });

  it('getUserById should return user when found', async () => {
    mockUsersService.findById.mockResolvedValue(mockUserWithPassword);
    await expect(service.getUserById('foo')).resolves.toEqual(mockUser);
  });

  it('getUserById should throw if not found', async () => {
    mockUsersService.findById.mockResolvedValue(null);
    await expect(service.getUserById('foo')).rejects.toThrow(BadRequestException);
  });

<<<<<<< Updated upstream
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
=======
  it('me should delegate to getUserById', async () => {
    mockUsersService.findById.mockResolvedValue(mockUserWithPassword);
    await expect(service.me('1')).resolves.toEqual(mockUser);
>>>>>>> Stashed changes
  });
});
