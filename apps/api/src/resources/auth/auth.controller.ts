import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { REST_RESOURCE, type JwtAuthRequest } from '@my-monorepo/types';

import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { AuthResponseDto, SignInDto } from './dto/auth.dto';
import { Public } from '../../common/guards/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local.guard';

@Controller(REST_RESOURCE.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(REST_RESOURCE.SIGNUP)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return await this.authService.signup(createUserDto);
  }

  @Post(REST_RESOURCE.SIGNIN)
  @Public()
  @UseGuards(LocalAuthGuard)
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signInWithCredentials(signInDto.email, signInDto.password);
  }

  @Get(REST_RESOURCE.ME as string)
  async getUserById(@Req() req: JwtAuthRequest): Promise<UserDto> {
    return this.authService.getUserById(req.user.userId);
  }
}
