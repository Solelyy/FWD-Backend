import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ExternalService } from '../service/external-admin.service';
@Controller('users/email')
export class ExternalSuperadminController {
  constructor(private readonly service: ExternalService) {}

  @Post('resend-email')
  @UseGuards(AuthGuard)
  async resendEmail(@Query('email') email: string) {
    await this.service.resendEmail(email);

    return {
      success: true,
      message: 'email verification sent',
    };
  }
}
