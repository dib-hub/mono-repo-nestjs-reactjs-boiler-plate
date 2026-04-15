import { IsEmail, IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import {
  IRequestPasswordReset,
  ICompletePasswordReset,
  IValidatePasswordResetToken,
} from '@my-monorepo/types';

export class RequestPasswordResetDto implements IRequestPasswordReset {
  @IsEmail()
  @IsString()
  email: string;
}

export class ValidatePasswordResetTokenDto implements IValidatePasswordResetToken {
  @IsString()
  @IsNotEmpty()
  @Length(32, 255)
  token: string;
}

export class CompletePasswordResetDto implements ICompletePasswordReset {
  @IsString()
  @IsNotEmpty()
  @Length(32, 255)
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  @Validate(
    (obj: CompletePasswordResetDto) => !obj.confirmPassword || obj.password === obj.confirmPassword,
    {
      message: 'confirmPassword must match password',
    }
  )
  confirmPassword: string;
}
