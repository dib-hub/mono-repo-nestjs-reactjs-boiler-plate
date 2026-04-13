export interface IResetPassword {
  email: string;
}

export interface ICompletePasswordReset extends IResetPassword {
  otp: string;
  password: string;
}

export interface IPasswordResetResponse {
  message: string;
}
