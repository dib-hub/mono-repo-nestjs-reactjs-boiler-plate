import { IUser } from './auth.interface';

export interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  success: boolean;
}
