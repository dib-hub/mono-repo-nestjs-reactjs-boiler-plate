import { IUserResponse } from './user-response.interface';

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
}
