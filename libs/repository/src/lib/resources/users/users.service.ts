import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, IUser, SignInDto } from '@my-monorepo/types';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublicUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }): IUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as IUser['role'],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => this.toPublicUser(user));
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toPublicUser(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toPublicUser(user);
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const email = createUserDto.email.trim().toLowerCase();
    const firstName = createUserDto.firstName.trim();
    const lastName = createUserDto.lastName.trim();
    const confirmPassword = createUserDto.confirmPassword ?? createUserDto.password;

    if (!firstName || !lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    if (createUserDto.password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.toPublicUser(createdUser);
  }

  async signIn(signInDto: SignInDto): Promise<IUser> {
    const email = signInDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return this.toPublicUser(user);
  }
}
