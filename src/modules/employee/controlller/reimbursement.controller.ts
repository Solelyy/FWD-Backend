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
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { CreateReimbursementDTO } from '../dto/reimbursement';
import { ReimbursementService } from '../service/reimbursements.service';

@Controller('employee')
export class ReimbursementController {
  constructor(private readonly service: ReimbursementService) {}

  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  @Post('reimbursement-request')
  async createLeave(
    @Req() req: RequestData,
    @Body(CustomValidationPipe) reqJson: CreateReimbursementDTO,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      console.log(employeeId);
      throw new NotFoundException('Invalid id');
    }

    const service = await this.service.createReimbursementRec(
      employeeId,
      reqJson,
    );

    return {
      success: true,
      message: 'requested reimbursement successfully',
      status: service.status,
    };
  }

  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('reimbursement-requests')
  async getRequests(@Req() req: RequestData) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      console.log(employeeId);
      throw new NotFoundException('Invalid Id');
    }

    const service = await this.service.getMyRecords(employeeId);

    return {
      success: true,
      message: 'reimbursements records retrieved successfully',
      records: service,
    };
  }

  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('reimbursement-summary')
  async totalRecords(@Req() req: RequestData) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      console.log(employeeId);
      throw new NotFoundException('User does not exists');
    }

    const service = await this.service.totalCashAdvance(employeeId);

    return {
      success: true,
      message: 'successfully retrieved leave summary',
      ...service,
    };
  }
}
