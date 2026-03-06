import { NestPassportMockModule } from '@my-monorepo/types';

import { JwtAuthGuard } from './jwt-auth.guard';

jest.mock(
  '@nestjs/passport',
  (): NestPassportMockModule => ({
    AuthGuard: (_strategy?: string | string[]) => class MockAuthGuard {},
  })
);

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
  });
});
