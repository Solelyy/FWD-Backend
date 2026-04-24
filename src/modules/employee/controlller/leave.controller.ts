import {
  Post,
  Controller,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { LeaveService } from '../service/leave.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { EmployeeLeaveDTO } from '../dto/create-leave';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';

@Controller('employee')
export class LeaveController {
  constructor(private readonly service: LeaveService) {}

  @Post('create-leave')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async createLeave(
    @Body(CustomValidationPipe) employee: EmployeeLeaveDTO,
    @Req() req: RequestData,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const service = await this.service.createLeave(employeeId, employee);

    return {
      success: true,
      message: 'user successfully requested leave',
      remainingBal: service,
    };
  }

  @Get('leave-balances')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async getLeaveBal(@Req() req: RequestData) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const service = await this.service.getLeaveBalances(employeeId);

    return {
      success: true,
      message: 'request balance retrieved successfully',
      sickLeaveBalance: service!.sickLeaveBalance,
      vacationLeaveBalance: service!.vacationLeaveBalance,
      accumulatedLeaveBalance: service!.accumulatedLeave,
    };
  }

  @Get('leave-requests')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllLeaveReq(@Req() req: RequestData) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const service = await this.service.getLeaveRequests(employeeId);

    return {
      success: true,
      message: 'request balance retrieved successfully',
      leaveRequests: service,
    };
  }
}
