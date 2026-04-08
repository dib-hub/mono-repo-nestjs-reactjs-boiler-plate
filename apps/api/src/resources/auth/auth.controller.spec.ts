/**
 * AuthController — integration tests
 *
 * Uses real PrismaService + UsersService + AuthService against the Docker test
 * database. JwtService is mocked (no real signing). GoogleAuthService is mocked
 * (external OAuth, no network calls in tests).
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService, UsersService } from '@my-monorepo/database';
import { AuthController } from '@src/resources/auth/auth.controller';
import { AuthService } from '@src/resources/auth/auth.service';
import { CreateUserDto, UserDto } from '@src/resources/auth/dto/user.dto';
import { GoogleAuthService } from '@src/services/google-auth/google-auth.service';
import { cleanUpUsers } from '@src/testUtils';

describe('AuthController', () => {
  let module: TestingModule;
  let controller: AuthController;
  let prisma: PrismaService;
  let testUser: UserDto;
  let googleAuthService: { loginWithGoogle: jest.Mock };
  const userIdsToClean: string[] = [];
  const dto: CreateUserDto = {
    email: 'auth-ctrl-test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123!',
  };

  beforeAll(async () => {
    googleAuthService = { loginWithGoogle: jest.fn() };

    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        PrismaService,
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') } },
        { provide: GoogleAuthService, useValue: googleAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    // Seed the test user via the real signUp path (no direct DB injection).
    const { user } = await controller.signUp(dto);
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
    module.get<JwtService>(JwtService).sign = jest.fn().mockReturnValue('mock-jwt-token');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── signUp ────────────────────────────────────────────────────────────────

  describe('signUp', () => {
    /** Separate DTO to avoid colliding with the user created in beforeAll. */
    const newUserDto: CreateUserDto = {
      email: 'auth-ctrl-new@example.com',
      firstName: 'New',
      lastName: 'User',
      password: 'Password123!',
    };

    it('creates a new user in DB and returns an auth response', async () => {
      const result = await controller.signUp(newUserDto);
      userIdsToClean.push(result.user.id!);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe(newUserDto.email);
      expect(result.user).not.toHaveProperty('password');

      const dbUser = await prisma.user.findUnique({ where: { email: newUserDto.email } });
      expect(dbUser).not.toBeNull();
    });

    it('throws BadRequestException when email is already in use', async () => {
      await expect(controller.signUp(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── signIn ────────────────────────────────────────────────────────────────

  describe('signIn', () => {
    it('returns auth response for the dto user (simulates LocalStrategy output)', async () => {
      const req = {
        user: {
          id: testUser.id,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: testUser.role,
        },
      };

      const result = await controller.signIn(req as any);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.id).toBe(testUser.id);
      expect(result.user.email).toBe(testUser.email);
    });
  });

  // ─── me ───────────────────────────────────────────────────────────────────

  describe('me', () => {
    it('returns the dto user from DB identified by JWT payload userId', async () => {
      const req = { user: { userId: testUser.id, email: testUser.email } };

      const result = await controller.me(req as any);

      expect(result.id).toBe(testUser.id);
      expect(result.email).toBe(testUser.email);
      expect(result).not.toHaveProperty('password');
    });
  });

  // ─── googleLogin ──────────────────────────────────────────────────────────

  describe('googleLogin', () => {
    it('delegates to GoogleAuthService (mocked — external OAuth) and returns its response', async () => {
      const mockResponse = {
        user: { id: testUser.id, email: testUser.email } as any,
        accessToken: 'google-jwt',
      };
      googleAuthService.loginWithGoogle.mockResolvedValue(mockResponse);

      const result = await controller.googleLogin({ idToken: 'fake-google-token' });

      expect(result).toEqual(mockResponse);
      expect(googleAuthService.loginWithGoogle).toHaveBeenCalledWith('fake-google-token');
    });
  });
});
