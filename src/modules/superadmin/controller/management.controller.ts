import { Get, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { AttendanceServiceFeature } from '../service/management.service';
import { Role } from '@prisma/client';
@Controller('superadmin/management')
export class AttendanceControllerFeature {
  constructor(private readonly attendance: AttendanceServiceFeature) {}

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
