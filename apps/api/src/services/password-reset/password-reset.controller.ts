import { Body, Controller, Post } from '@nestjs/common';
import { REST_RESOURCE } from '@my-monorepo/types';
import { Public } from '@src/common/guards/public.decorator';
import { PasswordResetService } from '@src/services/password-reset/password-reset.service';
import {
  RequestResetDto,
  VerifyResetDto,
} from '@src/services/password-reset/dto/password-reset.dto';

@Controller(REST_RESOURCE.AUTH + '/' + REST_RESOURCE.PASSWORD_RESET)
export class PasswordResetController {
  constructor(private readonly service: PasswordResetService) {}

  @Post(REST_RESOURCE.REQUEST)
  @Public()
  request(@Body() dto: RequestResetDto): Promise<{ message: string }> {
    return this.service.requestReset(dto.email);
  }

  @Post(REST_RESOURCE.VERIFY)
  @Public()
  verify(@Body() dto: VerifyResetDto): Promise<{ message: string }> {
    return this.service.verifyReset(dto.email, dto.otp, dto.password);
  }
}
