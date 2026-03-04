import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, IUser, SignInDto } from '@my-monorepo/types';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('us')
  getUser(): object {
    return {
      msg: 'Hello from AuthController',
    };
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<IUser> {
    return await this.authService.signIn(signInDto);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<IUser> {
    return await this.authService.getUserById(id);
  }

  // @Post('users')
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.signup(createUserDto);
  // }

  // @Get('users/:id')
  // async getUserById(@Param('id') id: string) {
  //   return this.authService.getUserById(id);
  // }
}
