import { UserRole } from './user';

describe('UserRole enum', () => {
  it('should have expected values', () => {
    expect(UserRole.ADMIN).toBe('ADMIN');
    expect(UserRole.USER).toBe('USER');
    expect(UserRole.GUEST).toBe('GUEST');
  });
});
