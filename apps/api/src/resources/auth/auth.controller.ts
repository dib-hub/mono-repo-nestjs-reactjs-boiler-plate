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

import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { AuthResponseDto, GoogleAuthDto } from './dto/auth.dto';
import { Public } from '../../common/guards/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local.guard';
import { GoogleAuthService } from '../../services/google-auth/google-auth.service';

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
