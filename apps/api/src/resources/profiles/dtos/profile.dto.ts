import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import type { IUpsertProfile, IProfileResponse, IProfile } from '@my-monorepo/types';

export class UpsertProfileDto implements IUpsertProfile {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe', nullable: true })
  @IsOptional()
  @IsUrl()
  linkedInUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://github.com/johndoe', nullable: true })
  @IsOptional()
  @IsUrl()
  githubUrl?: string | null;
}

export class ProfileResponseDto implements IProfileResponse {
  @ApiProperty({ description: 'Profile unique identifier', example: 'profile-uuid' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/johndoe',
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  linkedInUrl: string | null;

  @ApiProperty({
    description: 'GitHub profile URL',
    example: 'https://github.com/johndoe',
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  githubUrl: string | null;

  @ApiProperty({ description: 'User ID this profile belongs to', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Profile creation timestamp', example: '2024-03-05T12:34:56.789Z' })
  createdAt: Date;

  @ApiProperty({
    description: 'Profile last update timestamp',
    example: '2024-03-05T12:34:56.789Z',
  })
  updatedAt: Date;
}

export class ProfileDto implements IProfile {
  @ApiProperty({ example: 'profile-uuid', description: 'Profile unique identifier' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'https://linkedin.com/in/johndoe',
    description: 'LinkedIn profile URL',
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  linkedInUrl: string | null;

  @ApiProperty({
    example: 'https://github.com/johndoe',
    description: 'GitHub profile URL',
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  githubUrl: string | null;

  @ApiProperty({ example: 'user-uuid', description: 'User ID this profile belongs to' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '2024-03-05T12:34:56.789Z', description: 'Profile creation timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-05T12:34:56.789Z',
    description: 'Profile last update timestamp',
  })
  updatedAt: Date;
}
