import { NestPassportMockModule } from '@my-monorepo/types';

import { GoogleGuard } from './googleGuard';

jest.mock(
  '@nestjs/passport',
  (): NestPassportMockModule => ({
    AuthGuard: (_strategy?: string | string[]) => class MockAuthGuard {},
  })
);

describe('GoogleGuard', () => {
  it('should be defined', () => {
    const guard = new GoogleGuard();
    expect(guard).toBeDefined();
  });
});
