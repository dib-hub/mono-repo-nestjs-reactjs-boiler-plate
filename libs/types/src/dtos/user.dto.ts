import { UserRole } from '../entities/user';

export class CreateUserDto {
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
  confirmPassword?: string;
}

export class SignInDto {
  email!: string;
  password!: string;
}

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
}
