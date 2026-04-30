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
import { CreateCashAdvanceDTO } from '../dto/cash-advance';
import { CashAdvanceService } from '../service/cash-advance.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';

@Controller('employee')
export class CashAdvanceController {
  constructor(private readonly service: CashAdvanceService) {}

  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  @Post('cash-advance-request')
  async createLeave(
    @Req() req: RequestData,
    @Body(CustomValidationPipe) employee: CreateCashAdvanceDTO,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      console.log(employeeId);
      throw new NotFoundException('User does not exists');
    }

    const service = await this.service.createCashAdvance(employeeId, employee);

    return {
      success: true,
      message: 'added cash advance request successfully',
      cashRecordId: service.id,
    };
  }

  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('cash-advance-requests')
  async getRequests(@Req() req: RequestData) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      console.log(employeeId);
      throw new NotFoundException('User does not exists');
    }

    const service = await this.service.getMyRecords(employeeId);

    return {
      success: true,
      message: 'added cash advance request successfully',
      records: service,
    };
  }

  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('cash-advance-summary')
  async totalRecords(@Req() req: RequestData) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      console.log(employeeId);
      throw new NotFoundException('User does not exists');
    }

    const service = await this.service.totalCashAdvance(employeeId);

    return {
      success: true,
      message: 'total amount of cash advance retrieved successfully',
      totalAdvanced: service,
    };
  }
}
