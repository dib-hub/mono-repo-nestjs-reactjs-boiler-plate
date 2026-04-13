import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import type { IProfileFormData, IProfile } from '@my-monorepo/types';

export class UpsertProfileDto implements IProfileFormData {
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
  linkedInUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/johndoe', nullable: true })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;
}
export class ProfileDto extends UpsertProfileDto implements IProfile {
  @ApiProperty({ example: 'profile-uuid', description: 'Profile unique identifier' })
  @IsString()
  id: string;

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
