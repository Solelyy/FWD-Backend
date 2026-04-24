import {
  Get,
  Controller,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { AdminLeaveService } from '../service/leave.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { UpdateLeaveRecordDTO } from '../dto/update-leave-record';
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

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/leave-summary')
  async getLeaveSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    const service = await this.service.getEmployeeLeaveSummary(year, month);

    return {
      success: true,
      message: 'Leave records retrieved successfully',
      totalRequests: service.totalRequests,
      pending: service.pending,
      approved: service.approved,
      rejected: service.rejected,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employee/update-status')
  async approveOvertime(
    @Body(CustomValidationPipe) employee: UpdateLeaveRecordDTO,
    @Req() req: RequestData,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('Invalid id');
    }
    const service = await this.service.approveLeave(
      employeeId,
      employee.id,
      employee.status,
    );

    return {
      success: true,
      message: 'Successfully updated overtime status attendance',
      approvedBy: service.validated_by,
      validated_at: service.validateAt,
    };
  }
}
