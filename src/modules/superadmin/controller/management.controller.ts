import {
  Get,
  Controller,
  UseGuards,
  Patch,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { AttendanceServiceFeature } from '../service/management.service';
import { Role, Status } from '@prisma/client';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { AdminStatusDTO, AllowedAdminStatus } from '../dto/admin.status.dto';
import {
  AdminStatusSuspendedDTO,
  AllowedAdminStatusSuspended,
} from '../dto/admin.status.suspended.dto';
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
    if (!status) {
      throw new NotFoundException('must include status');
    }
    const result = await this.management.updateStatus({ employeeId, status });

    return {
      success: true,
      message: 'status updated',
      status: result,
    };
  }

  @Patch('employment')
  @UseGuards(AuthGuard)
  async updateAdminStatusSuspended(
    @Query('employee') employeeId: string,
    // receive only status body
    // receive only what body contains eg. DTOS
    // when patch is used
    @Body(CustomValidationPipe) status: AdminStatusSuspendedDTO,
  ) {
    if (!status.status) {
      throw new NotFoundException('must include status');
    }
    const result = await this.management.setStatusSuspended(employeeId, status);

    return {
      success: true,
      message: 'status updated',
      status: result,
    };
  }

  @Patch('remove-user')
  @UseGuards(AuthGuard)
  async deleteUser(@Query('employee') employeeId: string) {
    const res = await this.management.softDelete(employeeId);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
