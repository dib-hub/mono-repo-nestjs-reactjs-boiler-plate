import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, type IUser } from '@my-monorepo/types';

export class CreateUserDto implements Partial<IUser> {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class UserDto implements IUser {
  @ApiProperty({ example: 'user-uuid', description: 'User unique identifier' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: UserRole.USER, enum: UserRole, description: 'User role' })
  role: UserRole;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'User last update timestamp' })
  updatedAt: Date;
}
