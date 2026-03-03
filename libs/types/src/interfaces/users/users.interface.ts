export interface IUserWithPassword {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  createdAt: Date;
  updatedAt: Date;
}
