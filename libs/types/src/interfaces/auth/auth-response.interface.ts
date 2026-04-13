import { IUser, JWTUser } from '../users';

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

export interface JwtAuthRequest {
  user: JWTUser;
}

export interface IUserSignIn {
  email: string;
  password: string;
}

export interface IUserSignUp extends IUserSignIn {
  firstName: string;
  lastName: string;
}

export interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: {
    userId: string;
    email: string;
  };
  method?: string;
}
