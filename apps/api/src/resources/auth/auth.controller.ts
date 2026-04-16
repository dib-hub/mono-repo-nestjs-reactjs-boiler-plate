import { REST_RESOURCE, type JwtAuthRequest } from '@my-monorepo/types';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from '@src/common/guards/public.decorator';
import { TraceLogger } from '@src/common/logger/logger.service';
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
  RequestPasswordResetDto,
  CompletePasswordResetDto,
  ValidatePasswordResetTokenDto,
} from '@src/resources/auth/dto/password-reset.dto';

@Controller(REST_RESOURCE.AUTH)
export class AuthController {
  private readonly logger = new TraceLogger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly passwordResetService: PasswordResetService
  ) {}

  @Post(REST_RESOURCE.SIGNUP)
  @Public()
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.log('Handling sign-up request');
    return await this.authService.signup(createUserDto);
  }

  @Post(REST_RESOURCE.SIGNIN)
  @Public()
  async signIn(@Body() { email, password }: SignInDto): Promise<AuthResponseDto> {
    this.logger.log('Handling sign-in request');
    return await this.authService.signInWithCredentials(email, password);
  }

  @Post(REST_RESOURCE.GOOGLE)
  @Public()
  async googleLogin(@Body() { idToken }: GoogleAuthDto): Promise<{
    user: UserDto;
    accessToken: string;
  }> {
    this.logger.log('Handling Google sign-in request');
    return await this.googleAuthService.loginWithGoogle(idToken);
  }

  @Get(REST_RESOURCE.ME)
  async me(@Req() { user }: JwtAuthRequest): Promise<UserDto> {
    this.logger.log('Handling current user request');
    return await this.authService.getUserById(user.userId);
  }

  @Post(REST_RESOURCE.PASSWORD_RESET + '/' + REST_RESOURCE.REQUEST)
  @Public()
  requestPasswordReset(@Body() { email }: RequestPasswordResetDto): Promise<{ message: string }> {
    this.logger.log('Handling password reset request');
    return this.passwordResetService.requestPasswordReset(email);
  }

  @Post(REST_RESOURCE.PASSWORD_RESET + '/' + REST_RESOURCE.VERIFY)
  @Public()
  validatePasswordResetToken(
    @Body() { token }: ValidatePasswordResetTokenDto
  ): Promise<{ message: string }> {
    this.logger.log('Handling password reset token validation request');
    return this.passwordResetService.validateResetToken(token);
  }

  @Post(REST_RESOURCE.PASSWORD_RESET + '/' + REST_RESOURCE.COMPLETE)
  @Public()
  completePasswordReset(
    @Body() { password, token }: CompletePasswordResetDto
  ): Promise<{ message: string }> {
    this.logger.log('Handling password reset completion request');
    return this.passwordResetService.completePasswordReset(token, password);
  }
}
