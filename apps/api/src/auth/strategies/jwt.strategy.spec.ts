jest.mock('@nestjs/passport', () => ({
  PassportStrategy: (_strategy: unknown) =>
    class MockPassportStrategy {
      constructor(_options: unknown) {}
    },
}));
jest.mock('passport-jwt', () => ({
  ExtractJwt: { fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue('extractor') },
  Strategy: class MockJwtStrategy {},
}));

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate should return userId and email from payload', () => {
    const result = strategy.validate({ sub: '123', email: 'a@a.com' });
    expect(result).toEqual({ userId: '123', email: 'a@a.com' });
  });
});
