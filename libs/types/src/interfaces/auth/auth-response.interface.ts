import { JWTUser } from '../users';
import { IUserResponse } from './user-response.interface';

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
}

export interface JwtAuthRequest {
  user: JWTUser;
}
