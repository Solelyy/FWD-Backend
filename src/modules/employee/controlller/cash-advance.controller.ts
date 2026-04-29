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
  @Post('create-cash-request')
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
}
