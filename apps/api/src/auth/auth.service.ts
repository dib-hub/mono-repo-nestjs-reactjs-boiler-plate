import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import { CreateUserDto, IUser } from '@my-monorepo/types';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto): Promise<IUser> {
    return this.usersService.create(createUserDto);
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  // async validateGoogleUser(profile: any) {
  // const email = profile.emails[0].value;

  // let user = await this.prisma.user.findUnique({
  //   where: { email },
  // });

  // if (!user) {
  //   user = await this.prisma.user.create({
  //     data: {
  //       email,
  //       name: profile.displayName,
  //       googleId: profile.id,
  //     },
  //   });
  // }

  //   return {
  //     message: 'User validated successfully',
  //   };
  // }
}
