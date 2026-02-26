import { UserRole } from '../entities/user';

export class CreateUserDto {
  email!: string;
  name!: string;
  password!: string;
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
}

export class UserResponseDto {
  id!: string;
  email!: string;
  name!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
}
