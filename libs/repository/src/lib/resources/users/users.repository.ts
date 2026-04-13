import { Injectable } from '@nestjs/common';
import { CreateUser, IUser } from '@my-monorepo/types';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as Promise<IUser | null>;
  }

  findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<IUser | null>;
  }

  create(data: CreateUser): Promise<IUser> {
    return this.prisma.user.create({
      data,
    }) as Promise<IUser>;
  }

  findAll(): Promise<IUser[]> {
    return this.prisma.user.findMany() as Promise<IUser[]>;
  }
}
