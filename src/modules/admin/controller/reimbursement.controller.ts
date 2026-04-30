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
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { UpdateCashAdvanceDTO } from '../dto/cash-advance';
import { AdminReimbursementService } from '../service/reimbursement.service';
import { UpdateReimbursementDTO } from '../dto/reimbursement';

@Controller('admin')
export class AdminReimbursementController {
  constructor(private readonly service: AdminReimbursementService) {}

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/reimbursement-requests')
  async getAllReimbursements(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('filter') filter: string,
  ) {
    const service = await this.service.getAllReimbursements(
      page,
      limit,
      year,
      month,
      filter,
    );

    return {
      success: true,
      message: 'reimbursement logs retrieved successfully',
      requests: service.requests,
      meta: {
        page: service.meta.page,
        limit: service.meta.limit,
        total: service.meta.total,
      },
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/reimbursement-summary')
  async getReimbursementSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    const service = await this.service.getEmployeeCashAdvanceSummary(
      year,
      month,
    );

    return {
      success: true,
      message: 'reimbursements summary retrieved successfully',
      ...service,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employee/approve-reimbursement-request')
  async approveOvertime(
    @Body(CustomValidationPipe) update: UpdateReimbursementDTO,
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
