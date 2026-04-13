export interface IRequestReset {
  email: string;
}

export interface IVerifyReset extends IRequestReset {
  otp: string;
  password: string;
}

export interface IPasswordResetResponse {
  message: string;
}
