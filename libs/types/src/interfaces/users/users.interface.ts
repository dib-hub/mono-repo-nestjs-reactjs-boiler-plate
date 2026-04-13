export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
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
