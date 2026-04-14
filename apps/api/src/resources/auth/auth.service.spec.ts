/**
 * AuthService — integration tests
 *
 * Uses real PrismaService + UsersService against the Docker test database.
 * Only JwtService is mocked (no real signing needed).
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService, UsersService } from '@my-monorepo/database';
import { AuthService } from '@src/resources/auth/auth.service';
import { CreateUserDto, UserDto } from '@src/resources/auth/dto/user.dto';
import { cleanUpUsers } from '@src/testUtils';
import { UserRole } from '@my-monorepo/types';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;
  let prisma: PrismaService;
  let testUser: UserDto;
  const userIdsToClean: string[] = [];
  const dto: CreateUserDto = {
    email: 'auth-svc-test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: UserRole.USER,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        PrismaService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    // Seed the test user via the real signup path (no direct DB injection).
    const { user } = await service.signup(dto);
    testUser = user as UserDto;
    userIdsToClean.push(testUser.id);
  });

  afterAll(async () => {
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── signup ────────────────────────────────────────────────────────────────

  describe('signup', () => {
    /** Separate DTO to avoid colliding with the user created in beforeAll. */
    const newUserDto: CreateUserDto = {
      email: 'auth-svc-new@example.com',
      firstName: 'New',
      lastName: 'User',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: UserRole.USER,
    };

    it('hashes password, creates user, and returns a JWT', async () => {
      const result = await service.signup(newUserDto);
      userIdsToClean.push(result.user.id!);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe(newUserDto.email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('throws BadRequestException when email is already in use', async () => {
      await expect(service.signup(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── signInWithCredentials ─────────────────────────────────────────────────

  describe('signInWithCredentials', () => {
    it('returns auth response for valid credentials', async () => {
      const result = await service.signInWithCredentials(testUser.email, dto.password);

      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      await expect(service.signInWithCredentials(testUser.email, 'bad-pass')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      await expect(service.signInWithCredentials('ghost@example.com', 'pass')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  // ─── getUserById ───────────────────────────────────────────────────────────

  describe('getUserById', () => {
    it('returns user without password field', async () => {
      const result = await service.getUserById(testUser.id);

      expect(result.id).toBe(testUser.id);
      expect(result.email).toBe(testUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('throws BadRequestException when user is not found', async () => {
      await expect(service.getUserById('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
