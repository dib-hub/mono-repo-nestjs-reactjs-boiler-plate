import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { IRequestReset, IVerifyReset } from '@my-monorepo/types';

const normalizeEmail = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.toLowerCase().trim();
};

export class VerifyResetDto implements IVerifyReset {
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d+$/, { message: 'OTP must contain only numbers' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}

export class RequestResetDto implements IRequestReset {
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;
}
