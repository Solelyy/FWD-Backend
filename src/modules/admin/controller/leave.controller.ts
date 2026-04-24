import {
  Get,
  Controller,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { AdminLeaveService } from '../service/leave.service';
@Controller('admin')
export class AdminLeaveController {
  constructor(private readonly service: AdminLeaveService) {}

  @Get('employee/leave-balances')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAll() {
    const service = await this.service.getLeaveBalances();

    return {
      success: true,
      message: 'Leave balances retrieved successfully',
      employees: service,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/leave')
  async getAllAttendance(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('filter') filter: string,
  ) {
    const service = await this.service.getAllLeaveRequests(
      page,
      limit,
      year,
      month,
      filter,
    );

    return {
      success: true,
      message: 'Attendance logs retrieved successfully',
      logs: service.requests,
      meta: {
        page: service.meta.page,
        limit: service.meta.limit,
        total: service.meta.total,
      },
    };
  }
}
