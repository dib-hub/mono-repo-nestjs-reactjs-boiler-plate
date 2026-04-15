import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '@src/common/logger/logger.service';
import { AuthResponseDto, CreateUserDto, UserDto } from '@src/resources/auth/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {}

  private toUserDto(user: UserDto): UserDto {
    this.logger.log('Sanitizing user payload for response', AuthService.name);
    const { password: _password, ...safeUser } = user;
    return safeUser as UserDto;
  }

  private buildAuthResponse(user: UserDto): AuthResponseDto {
    this.logger.log('Building authentication response payload', AuthService.name);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    this.logger.log('Validating user credentials', AuthService.name);
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;
    if (!user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.toUserDto(user as UserDto);
  }

  async signup(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.log('Creating a new user account', AuthService.name);
    const existingUser = await this.usersService.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const { confirmPassword: _confirmPassword, ...userDataWithoutConfirmPassword } = createUserDto;
    const user = await this.usersService.create({
      ...userDataWithoutConfirmPassword,
      password: hashedPassword,
    });

    return this.buildAuthResponse(this.toUserDto(user as UserDto));
  }

  async signInWithCredentials(email: string, password: string): Promise<AuthResponseDto> {
    this.logger.log('Signing in with email and password', AuthService.name);
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async getUserById(id: string): Promise<UserDto> {
    this.logger.log('Fetching user by id', AuthService.name);
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.toUserDto(user as UserDto);
  }
}
