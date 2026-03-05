import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, UserDto } from './dto/user.dto';
import { AuthResponseDto, SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return null;

    return user as UserDto;
  }

  async signup(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: user as UserDto,
      accessToken,
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const email = signInDto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: user as UserDto,
      accessToken,
    };
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user as UserDto;
  }
}
