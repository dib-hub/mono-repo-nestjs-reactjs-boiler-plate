export interface IVerifyReset {
  email: string;
  otp: string;
  password: string;
}

export interface IRequestReset {
  email: string;
}

export interface IPasswordResetResponse {
  message: string;
}
