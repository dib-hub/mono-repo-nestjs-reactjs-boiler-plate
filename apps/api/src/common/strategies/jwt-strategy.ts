// jwt.strategy.ts

import type { JWTUser } from '@my-monorepo/types/src/interfaces/users';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'],
    });
  }

  validate(payload: JWTUser): JWTUser {
    if (!payload.sub || !payload.email) {
      throw new Error('Invalid token payload');
    }
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
