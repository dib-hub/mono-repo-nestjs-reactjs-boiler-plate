import {
  type IAuthResponse,
  type IGoogleAuth,
  type ISignIn,
  type IUpdateUser,
  UserRole,
} from '@my-monorepo/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { UserDto } from './user.dto';

export class SignInDto implements ISignIn {
  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class GoogleAuthDto implements IGoogleAuth {
  @ApiProperty({
    description: 'Google ID token returned by Google OAuth',
  })
  @IsString()
  @MinLength(1)
  idToken: string;
}

export class UpdateUserDto implements IUpdateUser {
  @ApiPropertyOptional({
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: 'Password123',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class AuthResponseDto implements IAuthResponse {
  @ApiProperty({
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}
