export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTUser {
  sub?: string;
  email: string;
  userId: string;
}
