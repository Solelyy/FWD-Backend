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
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
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

  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('users')
  async getAdmins() {
    const viewAdmins = await this.management.viewAdmins();

    return {
      data: viewAdmins,
      succcess: true,
      message: 'successfully retrieved',
    };
  }

  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('status')
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

  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employment')
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

  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('remove-user')
  async deleteUser(@Query('employee') employeeId: string) {
    const res = await this.management.softDelete(employeeId);

    return {
      success: true,
      message: 'User deleted successfully',
      deleted: res.isDeleted,
    };
  }
}
