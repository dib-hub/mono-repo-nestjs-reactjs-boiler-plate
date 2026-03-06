import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { REST_RESOURCE, REST_RESOURCE_ID } from '@my-monorepo/types';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { AuthResponseDto, SignInDto } from './dto/auth.dto';

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

  @Get(`${REST_RESOURCE.USERS}/${REST_RESOURCE_ID.ID}`)
  async getUserById(@Param(REST_RESOURCE.ID) id: string): Promise<UserDto> {
    return await this.authService.getUserById(id);
  }
}
