import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IUser, REST_RESOURCE } from '@my-monorepo/types';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, SignInDto, AuthResponseDto } from './dto/user.dto';

@Controller(REST_RESOURCE.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(REST_RESOURCE.SIGNUP)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return await this.authService.signup(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post(REST_RESOURCE.SIGNIN)
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(signInDto);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<IUser> {
    return await this.authService.getUserById(id);
  }
}
