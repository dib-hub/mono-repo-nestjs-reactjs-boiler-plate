import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IUser, REST_RESOURCE, type JwtAuthRequest } from '@my-monorepo/types';
import { Public } from '@src/common/guards/public.decorator';
import { AuthService } from '@src/resources/auth/auth.service';
import { AuthResponseDto, GoogleAuthDto, SignInDto } from '@src/resources/auth/dto/auth.dto';
import { CreateUserDto, UserDto } from '@src/resources/auth/dto/user.dto';
import { GoogleAuthService } from '@src/services/google-auth/google-auth.service';

@Controller(REST_RESOURCE.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService
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
    user: IUser;
    accessToken: string;
  }> {
    return await this.googleAuthService.loginWithGoogle(idToken);
  }

  @Get(REST_RESOURCE.ME)
  async me(@Req() req: JwtAuthRequest): Promise<UserDto> {
    return await this.authService.getUserById(req.user.userId);
  }
}
