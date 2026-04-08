import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@my-monorepo/types';
import { AuthResponseDto } from '@src/resources/auth/dto/auth.dto';
import { CreateUserDto, UserDto } from '@src/resources/auth/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  private toUserDto(user: UserDto & { password?: string }): UserDto {
    const { password: _password, ...safeUser } = user;
    return safeUser as UserDto;
  }

  private buildAuthResponse(user: UserDto): AuthResponseDto {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return null;

    return this.toUserDto(user as UserDto & { password?: string });
  }

  async signup(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: hashedPassword,
      role: UserRole.USER,
    });

    return this.buildAuthResponse(this.toUserDto(user as UserDto & { password?: string }));
  }

  async signInWithCredentials(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.toUserDto(user as UserDto & { password?: string });
  }
}
