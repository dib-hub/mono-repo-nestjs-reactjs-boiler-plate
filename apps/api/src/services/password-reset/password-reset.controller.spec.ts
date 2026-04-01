jest.mock('@my-monorepo/database', () => ({
  PrismaService: class {},
}));

import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

type PasswordResetServiceMock = {
  requestReset: jest.Mock;
  verifyReset: jest.Mock;
};

describe('PasswordResetController', () => {
  let controller: PasswordResetController;
  let service: PasswordResetServiceMock;

  beforeEach(() => {
    service = {
      requestReset: jest.fn(),
      verifyReset: jest.fn(),
    };

    controller = new PasswordResetController(service as unknown as PasswordResetService);
  });

  it('should request OTP reset for the provided email', async () => {
    service.requestReset.mockResolvedValue({ message: 'OTP sent to your email' });

    const result = await controller.request({ email: 'test@example.com' });

    expect(result).toEqual({ message: 'OTP sent to your email' });
    expect(service.requestReset).toHaveBeenCalledWith('test@example.com');
  });

  it('should verify OTP reset payload', async () => {
    service.verifyReset.mockResolvedValue({ message: 'Password updated' });

    const result = await controller.verify({
      email: 'test@example.com',
      otp: '123456',
      password: 'newStrongPassword123',
    });

    expect(result).toEqual({ message: 'Password updated' });
    expect(service.verifyReset).toHaveBeenCalledWith(
      'test@example.com',
      '123456',
      'newStrongPassword123'
    );
  });
});
