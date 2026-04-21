export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp extends ISignIn {
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface CreateUser extends ISignUp {
  confirmPassword: string;
}

export interface IUser extends Omit<CreateUser, 'confirmPassword'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTUser {
  sub?: string;
  email: string;
  userId: string;
}

export interface JwtAuthRequest {
  user: JWTUser;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

export interface IGoogleAuth {
  idToken: string;
}

export type IUpdateUser = Partial<ISignUp>;

export type IRequestPasswordReset = Omit<ISignIn, 'password'>;

export interface IValidatePasswordResetToken {
  token: string;
}

export interface ICompletePasswordReset extends IValidatePasswordResetToken {
  password: string;
  confirmPassword: string;
}

export interface IPasswordResetResponse {
  message: string;
}

export type ValidPasswordRecord = Partial<IUser>;
