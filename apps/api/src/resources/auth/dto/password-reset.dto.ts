import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { IResetPassword, ICompletePasswordReset } from '@my-monorepo/types';

export class ResetPasswordDto implements IResetPassword {
  @IsEmail()
  @IsString()
  email: string;
}

export class CompletePasswordResetDto extends ResetPasswordDto implements ICompletePasswordReset {
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
