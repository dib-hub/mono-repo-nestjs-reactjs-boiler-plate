import {
  CreateUser,
  IUpdateUser,
  IUser,
  UserRole,
  type IAuthResponse,
  type IGoogleAuth,
  type ISignIn,
  type ISignUp,
} from '@my-monorepo/types';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, Validate } from 'class-validator';

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

export class SignUpDto extends SignInDto implements ISignUp {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'User role',
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class GoogleAuthDto implements IGoogleAuth {
  @ApiProperty({
    description: 'Google ID token returned by Google OAuth',
  })
  @IsString()
  @MinLength(1)
  idToken: string;
}

export class CreateUserDto extends SignUpDto implements CreateUser {
  @ApiProperty({
    example: 'StrongPassword123',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @Validate((obj: CreateUserDto) => !obj.confirmPassword || obj.password === obj.confirmPassword, {
    message: 'confirmPassword must match password',
  })
  confirmPassword: string;
}

export class UserDto extends OmitType(CreateUserDto, ['confirmPassword']) implements IUser {
  @ApiProperty({ example: 'user-uuid', description: 'User unique identifier' })
  @IsString()
  id: string;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'User last update timestamp' })
  updatedAt: Date;
}

export class UpdateUserDto extends PartialType(SignUpDto) implements IUpdateUser {}

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
