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
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { ManagementServiceFeature } from '../service/management.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import {
  AllowedEmployeeStatus,
  EmployeeStatusDTO,
} from '../dto/admin.status.dto';
import { EmployeeStatusSuspendedDTO } from '../dto/admin.status.suspended.dto';
import { AllowedAdminStatus } from 'src/modules/superadmin/dto/admin.status.dto';
@Controller('admin/management')
export class ManagementControllerFeature {
  constructor(private readonly management: ManagementServiceFeature) {}

  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
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

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('status')
  async updateAdminStatus(
    @Query('employee') employeeId: string,
    // receive only status body
    @Body('status', CustomValidationPipe) status: AllowedEmployeeStatus,
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

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employment')
  async updateAdminStatusSuspended(
    @Query('employee') employeeId: string,
    // receive only status body
    // receive only what body contains eg. DTOS
    // when patch is used
    @Body(CustomValidationPipe) status: EmployeeStatusSuspendedDTO,
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

  @Roles('ADMIN')
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

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employees')
  async getAllEmployees() {
    const service = await this.management.getAllEmployees();

    return {
      success: true,
      message: 'account status retrieved successfully',
      totalAccounts: service.totalAccounts,
      totalActive: service.totalActive,
      totalInactive: service.totalInactive,
      totalPending: service.totalPending,
      totalExpired: service.totalExpired,
      totalSuspended: service.totalSuspended,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get-employee-data')
  async getEmployeeData() {
    const service = await this.management.getSummaryDashboardEmployeeRecords();

    return {
      sucess: true,
      message: 'successfully retrieved employee data',
      ...service,
    };
  }
}
