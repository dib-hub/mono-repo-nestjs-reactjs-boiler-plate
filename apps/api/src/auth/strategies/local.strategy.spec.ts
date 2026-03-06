jest.mock('@my-monorepo/database', () => ({}));
jest.mock('@nestjs/passport', () => ({
  PassportStrategy: (_strategy: unknown) =>
    class MockPassportStrategy {
      constructor(_options: unknown) {}
    },
}));
jest.mock('passport-local', () => ({
  Strategy: class MockLocalStrategy {},
}));

import { UnauthorizedException } from '@nestjs/common';
import { IUser, UserRole } from '@my-monorepo/types';

import { LocalStrategy } from './local.strategy';
import { AuthService } from '../../resources/auth/auth.service';

const mockAuthService = {
  validateUser: jest.fn(),
};

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new LocalStrategy(mockAuthService as unknown as AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate should return user when credentials are valid', async () => {
    const user: IUser = {
      id: '1',
      email: 'a@a.com',
      firstName: 'A',
      lastName: 'B',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockAuthService.validateUser.mockResolvedValue(user);
    await expect(strategy.validate('a@a.com', 'pw')).resolves.toBe(user);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith('a@a.com', 'pw');
  });

  it('validate should throw UnauthorizedException when user not found', async () => {
    mockAuthService.validateUser.mockResolvedValue(null);
    await expect(strategy.validate('x@x.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });
});
