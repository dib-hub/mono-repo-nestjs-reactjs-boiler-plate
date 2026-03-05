import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@my-monorepo/types';
import { ISignIn } from '@my-monorepo/types/src/interfaces/auth/sign-in.interface';
import { IUpdateUser } from '@my-monorepo/types/src/interfaces/auth/update-user.interface';
import { IUserResponse } from '@my-monorepo/types/src/interfaces/auth/user-response.interface';
import { IAuthResponse } from '@my-monorepo/types/src/interfaces/auth/auth-response.interface';

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
}

export class UserResponseDto implements IUserResponse {
  @ApiProperty({
    example: 'clx9z2kq00001abc123',
  })
  id: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class AuthResponseDto implements IAuthResponse {
  @ApiProperty({
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}
