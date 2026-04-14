import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { REST_RESOURCE, type JwtAuthRequest } from '@my-monorepo/types';
import { Public } from '@src/common/guards/public.decorator';
import { AuthService } from '@src/resources/auth/auth.service';
import {
  AuthResponseDto,
  CreateUserDto,
  GoogleAuthDto,
  SignInDto,
  UserDto,
} from '@src/resources/auth/dto/auth.dto';
import { GoogleAuthService } from '@src/services/google-auth/google-auth.service';
import { PasswordResetService } from '@src/services/password-reset/password-reset.service';
import {
  ResetPasswordDto,
  CompletePasswordResetDto,
} from '@src/resources/auth/dto/password-reset.dto';

@Controller(REST_RESOURCE.AUTH)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly passwordResetService: PasswordResetService
  ) {}

  @Post(REST_RESOURCE.SIGNUP)
  @Public()
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return await this.authService.signup(createUserDto);
  }

  @Post(REST_RESOURCE.SIGNIN)
  @Public()
  async signIn(@Body() body: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signInWithCredentials(body.email, body.password);
  }

  @Post(REST_RESOURCE.GOOGLE)
  @Public()
  async googleLogin(@Body() { idToken }: GoogleAuthDto): Promise<{
    user: UserDto;
    accessToken: string;
  }> {
    return await this.googleAuthService.loginWithGoogle(idToken);
  }

  @Get(REST_RESOURCE.ME)
  async me(@Req() req: JwtAuthRequest): Promise<UserDto> {
    return await this.authService.getUserById(req.user.userId);
  }

  @Post(REST_RESOURCE.PASSWORD_RESET + '/' + REST_RESOURCE.REQUEST)
  @Public()
  requestPasswordReset(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    this.logger.log(`the email is ${dto.email}`);
    return this.passwordResetService.requestReset(dto.email);
  }

  @Post(REST_RESOURCE.PASSWORD_RESET + '/' + REST_RESOURCE.VERIFY)
  @Public()
  verifyPasswordReset(@Body() dto: CompletePasswordResetDto): Promise<{ message: string }> {
    return this.passwordResetService.verifyReset(dto.email, dto.otp, dto.password);
  }
}
