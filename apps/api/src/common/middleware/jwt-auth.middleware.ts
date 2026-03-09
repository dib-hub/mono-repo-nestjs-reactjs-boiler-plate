import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: {
    userId: string;
    email: string;
  };
  method?: string;
}
// it is main middleware use for authentication
type Next = (error?: unknown) => void;

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: AuthenticatedRequest, _res: unknown, next: Next): void {
    if (req.method === 'OPTIONS') {
      next();
      return;
    }

    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization header must be in Bearer format');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(token);
      req.user = {
        userId: payload.sub,
        email: payload.email,
      };
      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
