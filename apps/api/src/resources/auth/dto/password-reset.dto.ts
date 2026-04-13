import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { IRequestReset, IVerifyReset } from '@my-monorepo/types';

const normalizeEmail = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.toLowerCase().trim();
};

export class RequestResetDto implements IRequestReset {
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;
}

export class VerifyResetDto extends RequestResetDto implements IVerifyReset {
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
