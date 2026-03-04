export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  createdAt: Date;
  updatedAt: Date;
}
