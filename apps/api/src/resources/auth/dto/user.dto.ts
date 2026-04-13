import { IsEmail, IsEnum, IsOptional, IsString, MinLength, Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { CreateUser, IUpdateUser, UserRole, type IUser } from '@my-monorepo/types';

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

export class CreateUserDto implements CreateUser {
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

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Validate((obj: CreateUserDto) => obj.password === obj.confirmPassword, {
    message: 'confirmPassword must match password',
  })
  confirmPassword: string;

  @ApiProperty({
    example: UserRole.USER,
    enum: UserRole,
    description: 'User role',
  })
  @IsEnum(UserRole)
  role: UserRole;
}

// Omit confirmPassword from here
export class UserDto
  extends OmitType(CreateUserDto, ['confirmPassword'])
  implements Omit<IUser, 'confirmPassword'>
{
  @ApiProperty({ example: 'user-uuid', description: 'User unique identifier' })
  @IsString()
  id: string;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'User last update timestamp' })
  updatedAt: Date;
}
