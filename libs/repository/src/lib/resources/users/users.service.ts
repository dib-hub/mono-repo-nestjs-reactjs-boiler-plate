import { Injectable } from '@nestjs/common';
import { IUser } from '@my-monorepo/types';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<IUser[]> {
    return this.prisma.user.findMany() as Promise<IUser[]>;
  }
}
