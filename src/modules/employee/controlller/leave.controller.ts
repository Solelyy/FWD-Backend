import {
  Post,
  Controller,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { LeaveService } from '../service/leave.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { EmployeeLeaveDTO } from '../dto/create-leave';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';

@Controller('employee')
class LeaveController {
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
}
