import {
  Query,
  Controller,
  UseGuards,
  Get,
  ParseIntPipe,
  Patch,
  Req,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { AdminCashAdvanceService } from '../service/cash-advance.service';
import { CreateCashAdvanceDTO } from 'src/modules/employee/dto/cash-advance';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { UpdateCashAdvanceDTO } from '../dto/cash-advance';

@Controller('admin')
export class AdminCashAdvanceController {
  constructor(private readonly service: AdminCashAdvanceService) {}

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/cash-request')
  async getCashAdvance() {
    const service = await this.service.getAllCashAdvanceReq();

    return {
      success: true,
      message: 'retrieved cash advance records',
      records: service,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/cash-advance-requests')
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
      message: 'cash advance logs retrieved successfully',
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
  @Get('employee/cash-advance-summary')
  async getLeaveSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    const service = await this.service.getEmployeeCashAdvanceSummary(
      year,
      month,
    );

    return {
      success: true,
      message: 'Leave records retrieved successfully',
      ...service,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employee/approve-request')
  async approveOvertime(
    @Body(CustomValidationPipe) update: UpdateCashAdvanceDTO,
    @Req() req: RequestData,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('Invalid id');
    }
    const service = await this.service.approveRequest(
      employeeId,
      update.id,
      update.status,
    );

    return {
      success: true,
      message: 'Successfully update cashadvance request',
      approvedBy: service.approved_by,
      validated_at: service.approvedAt,
      amountApproved: service.amountApproved,
    };
  }
}
