import { Get, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ManagementServiceFeature } from '../service/management.service';

@Controller('admin/management')
export class ManagementControllerFeature {
  constructor(private readonly attendance: ManagementServiceFeature) {}

  @Get('users')
  @UseGuards(AuthGuard)
  async getAdmins() {
    const viewAdmins = await this.attendance.viewAdmins();

    return {
      data: viewAdmins,
      succcess: true,
      message: 'successfully retrieved',
    };
  }
}
