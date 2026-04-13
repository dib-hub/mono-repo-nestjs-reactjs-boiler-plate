import { IUser, JWTUser, UserRole } from '../users';

export interface JwtAuthRequest {
  user: JWTUser;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp extends ISignIn {
  firstName: string;
  lastName: string;
  confirmPassword?: string;
}

export interface IGoogleAuth {
  idToken: string;
}

export interface IUpdateUser extends Partial<Omit<ISignUp, 'confirmPassword'>> {
  role?: UserRole;
}
