import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IUser, REST_RESOURCE, REST_RESOURCE_ID, type JwtAuthRequest } from '@my-monorepo/types';
import { LocalAuthGuard } from '@src/common/guards/local.guard';
import { Public } from '@src/common/guards/public.decorator';
import { AuthService } from '@src/resources/auth/auth.service';
import { AuthResponseDto, GoogleAuthDto } from '@src/resources/auth/dto/auth.dto';
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
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() req: { user: UserDto }): Promise<AuthResponseDto> {
    return await this.authService.signIn(req.user);
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

  @Get(REST_RESOURCE_ID.ID)
  async getUserById(@Param('id') id: string, @Req() req: JwtAuthRequest): Promise<UserDto> {
    if (req.user.userId !== id) {
      throw new ForbiddenException();
    }
    return await this.authService.getUserById(id);
  }
}
