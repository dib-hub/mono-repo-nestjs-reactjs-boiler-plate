import { CreateUserDto, SignInDto, UpdateUserDto, UserResponseDto } from './user.dto';

describe('DTO classes', () => {
  it('should instantiate CreateUserDto', () => {
    const dto = new CreateUserDto();
    dto.email = 'a@a.com';
    dto.firstName = 'A';
    dto.lastName = 'B';
    dto.password = 'pw';
    expect(dto).toHaveProperty('email', 'a@a.com');
  });

  it('should instantiate SignInDto', () => {
    const dto = new SignInDto();
    dto.email = 'a@a.com';
    dto.password = 'pw';
    expect(dto).toHaveProperty('password', 'pw');
  });

  it('should instantiate UpdateUserDto and UserResponseDto', () => {
    const update = new UpdateUserDto();
    update.email = 'b@b.com';
    expect(update.email).toBe('b@b.com');

    const res = new UserResponseDto();
    res.id = '1';
    expect(res.id).toBe('1');
  });
});
