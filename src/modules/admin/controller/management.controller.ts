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

  @Patch('employment')
  @UseGuards(AuthGuard)
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
}
