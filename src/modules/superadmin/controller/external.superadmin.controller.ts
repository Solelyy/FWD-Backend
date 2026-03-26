import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ExternalService } from '../service/external-superadmin.service';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
@Controller('users/email')
export class ExternalSuperadminController {
  constructor(private readonly service: ExternalService) {}

  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Post('resend-email')
  async resendEmail(@Query('email') email: string) {
    const user = await this.service.resendEmail(email);

    return {
      success: true,
      message: 'email verification sent',
      status: user.status,
    };
  }
}
