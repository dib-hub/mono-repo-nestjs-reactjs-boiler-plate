import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import { IUser } from '@my-monorepo/types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, SignInDto, AuthResponseDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  private toPublicUser(user: IUser): IUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return null;

    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const email = createUserDto.email.trim().toLowerCase();
    const firstName = createUserDto.firstName.trim();
    const lastName = createUserDto.lastName.trim();

    if (!firstName || !lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: this.toPublicUser(user),
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
      user: this.toPublicUser(user),
      accessToken,
    };
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.toPublicUser(user as IUser);
  }
}
