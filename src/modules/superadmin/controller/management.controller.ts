import { Get, Controller, UseGuards, Patch, Query, Body } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { AttendanceServiceFeature } from '../service/management.service';
import { Role, Status } from '@prisma/client';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { AdminStatusDTO, AllowedAdminStatus } from '../dto/admin.status.dto';
@Controller('superadmin/management')
export class AttendanceControllerFeature {
  constructor(private readonly management: AttendanceServiceFeature) {}

  @Get('users')
  @UseGuards(AuthGuard)
  async getAdmins() {
    const viewAdmins = await this.management.viewAdmins();

    return {
      data: viewAdmins,
      succcess: true,
      message: 'successfully retrieved',
    };
  }

  @Patch('status')
  @UseGuards(AuthGuard)
  async updateAdminStatus(
    @Query('employee') employeeId: string,
    // receive only status body
    @Body('status', CustomValidationPipe) status: AllowedAdminStatus,
  ) {
    await this.management.updateStatus({ employeeId, status });

    return {
      success: true,
      message: 'status updated',
    };
  }
}
