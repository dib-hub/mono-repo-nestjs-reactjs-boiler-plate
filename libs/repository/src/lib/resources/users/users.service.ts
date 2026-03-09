import { Injectable } from '@nestjs/common';

import type { User as DbUser, UserRole } from '../../generated/client/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<DbUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<DbUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRole;
  }): Promise<DbUser> {
    return this.prisma.user.create({
      data,
    });
  }

  findAll(): Promise<DbUser[]> {
    return this.prisma.user.findMany();
  }
}
