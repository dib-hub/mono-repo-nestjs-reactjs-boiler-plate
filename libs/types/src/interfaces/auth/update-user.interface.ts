import { UserRole } from '../../entities/user';

export interface IUpdateUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}
