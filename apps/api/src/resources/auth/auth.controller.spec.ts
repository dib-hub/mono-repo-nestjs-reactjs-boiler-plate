import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService, UsersService } from '@my-monorepo/database';
import { AuthController } from '@src/resources/auth/auth.controller';
import { LoggerService } from '@src/common/logger/logger.service';
import { AuthService } from '@src/resources/auth/auth.service';
import { GoogleAuthService } from '@src/services/google-auth/google-auth.service';
import { PasswordResetService } from '@src/services/password-reset/password-reset.service';
import { cleanUpUsers } from '@src/testUtils';
import { CreateUserDto, UserDto } from '@src/resources/auth/dto/auth.dto';
import { UserRole } from '@my-monorepo/types';

describe('AuthController', () => {
  let module: TestingModule;
  let controller: AuthController;
  let prisma: PrismaService;
  let testUser: UserDto;
  let googleAuthService: { loginWithGoogle: jest.Mock };
  let passwordResetService: {
    requestPasswordReset: jest.Mock;
    validateResetToken: jest.Mock;
    completePasswordReset: jest.Mock;
  };
  let loggerService: {
    log: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    verbose: jest.Mock;
  };
  const userIdsToClean: string[] = [];
  const dto: CreateUserDto = {
    email: 'auth-ctrl-test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: UserRole.USER,
  };

  beforeAll(async () => {
    googleAuthService = { loginWithGoogle: jest.fn() };
    passwordResetService = {
      requestPasswordReset: jest.fn(),
      validateResetToken: jest.fn(),
      completePasswordReset: jest.fn(),
    };
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        PrismaService,
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') } },
        { provide: GoogleAuthService, useValue: googleAuthService },
        { provide: PasswordResetService, useValue: passwordResetService },
        { provide: LoggerService, useValue: loggerService },
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
      confirmPassword: 'Password123!',
      role: UserRole.USER,
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
    it('returns auth response for valid credentials', async () => {
      const result = await controller.signIn({
        email: dto.email,
        password: dto.password,
      } as any);

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

describe('AuthController (password reset) — unit tests', () => {
  let controller: AuthController;
  let passwordResetService: {
    requestPasswordReset: jest.Mock;
    validateResetToken: jest.Mock;
    completePasswordReset: jest.Mock;
  };
  let loggerService: {
    log: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    verbose: jest.Mock;
  };

  beforeEach(() => {
    passwordResetService = {
      requestPasswordReset: jest.fn(),
      validateResetToken: jest.fn(),
      completePasswordReset: jest.fn(),
    };
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    // Pure unit test: dummy dependencies, only passwordResetService is used.
    controller = new AuthController(
      {} as unknown as AuthService,
      {} as unknown as GoogleAuthService,
      passwordResetService as unknown as PasswordResetService,
      loggerService as unknown as LoggerService
    );
  });

  it('requests reset link for the provided email', async () => {
    passwordResetService.requestPasswordReset.mockResolvedValue({
      message: 'If an account exists for this email, a reset link has been sent.',
    });

    const result = await controller.requestPasswordReset({ email: 'test@example.com' } as any);

    expect(result).toEqual({
      message: 'If an account exists for this email, a reset link has been sent.',
    });
    expect(passwordResetService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
  });

  it('validates reset token separately before password update', async () => {
    passwordResetService.validateResetToken.mockResolvedValue({ message: 'Reset token is valid' });

    const result = await controller.validatePasswordResetToken({
      token: 'a-valid-token',
    } as any);

    expect(result).toEqual({ message: 'Reset token is valid' });
    expect(passwordResetService.validateResetToken).toHaveBeenCalledWith('a-valid-token');
  });

  it('completes password reset with the provided token payload', async () => {
    passwordResetService.completePasswordReset.mockResolvedValue({ message: 'Password updated' });

    const result = await controller.completePasswordReset({
      token: 'a-valid-token',
      password: 'newStrongPassword123',
      confirmPassword: 'newStrongPassword123',
    } as any);

    expect(result).toEqual({ message: 'Password updated' });
    expect(passwordResetService.completePasswordReset).toHaveBeenCalledWith(
      'a-valid-token',
      'newStrongPassword123'
    );
  });
});
