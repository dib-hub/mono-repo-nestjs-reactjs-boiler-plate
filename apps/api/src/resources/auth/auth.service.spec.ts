// ensure database package (which pulls in Prisma) is mocked before loading AuthService
jest.mock('@my-monorepo/database', () => ({
  UsersService: class {},
}));

import { BadRequestException } from '@nestjs/common';
import { IUser, UserRole } from '@my-monorepo/types';
import { UsersService } from '@my-monorepo/database';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';
import { SignInDto } from './dto/auth.dto';

// minimal typed mock for UsersService
type UsersServiceMock = Partial<UsersService> & {
  create: jest.Mock;
  signIn: jest.Mock;
  findById: jest.Mock;
};

const mockUsersService: UsersServiceMock = {
  create: jest.fn(),
  signIn: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockUsersService as unknown as UsersService, mockJwtService as any);
  });

  it('should delegate signup to usersService.create', async () => {
    const dto: CreateUserDto = { email: 'a@a.com', firstName: 'A', lastName: 'B', password: 'pw' };
    const result: IUser = {
      id: '1',
      email: 'a@a.com',
      firstName: 'A',
      lastName: 'B',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsersService.create.mockResolvedValue(result);

    await expect(service.signup(dto)).resolves.toBe(result);
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate signIn to usersService.signIn', async () => {
    const dto: SignInDto = { email: 'a@a.com', password: 'pw' };
    const result: IUser = {
      id: '1',
      email: 'a@a.com',
      firstName: '',
      lastName: '',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsersService.signIn.mockResolvedValue(result);

    await expect(service.signIn(dto)).resolves.toBe(result);
    expect(mockUsersService.signIn).toHaveBeenCalledWith(dto);
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
});
