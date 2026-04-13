import { type IAuthResponse, type IGoogleAuth, type ISignIn } from '@my-monorepo/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

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
