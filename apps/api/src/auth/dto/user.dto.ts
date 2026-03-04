import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUser, UserRole } from '@my-monorepo/types';

export class CreateUserDto implements Partial<IUser> {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsString()
  @MinLength(2)
  lastName!: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class UpdateUserDto {
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

export class UserResponseDto {
  @ApiProperty({
    example: 'clx9z2kq00001abc123',
  })
  id!: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  email!: string;

  @ApiProperty({
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  role!: string;

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
  })
  updatedAt!: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    type: UserResponseDto,
  })
  user!: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken!: string;
}
