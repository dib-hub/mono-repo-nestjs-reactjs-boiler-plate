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
import { REST_RESOURCE, REST_RESOURCE_ID, type JwtAuthRequest } from '@my-monorepo/types';

import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { AuthResponseDto } from './dto/auth.dto';
import { Public } from '../../common/guards/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local.guard';

@Controller(REST_RESOURCE.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get(REST_RESOURCE.ME as string)
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
