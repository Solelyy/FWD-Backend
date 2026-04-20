import { Controller, Get, ParseIntPipe,Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ExternalService } from '../service/external-admin.service';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { AdminAttendanceService } from '../service/attendance.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { AddAttendanceDTO } from '../dto/add-attendance.dto';

@Controller('admin')
export class AdminAttendanceController {
  constructor(private readonly service: AdminAttendanceService) {}

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee-attendance')
  async resendEmail(@Query('year', ParseIntPipe) year: number,
@Query('month', ParseIntPipe) month: number,
@Query('day', ParseIntPipe) day: number
) {
   
    const service = await this.service.getEmployeeAttendance(year, month, day)

    return {
        success: true,
        message: service.message,
        presentToday:service.presentToday,
    absentToday: service.absentToday,
    onLeave: service.onLeave, 
    pendingOvertime: service.pendingOvertime

    }
}

 @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Post('employee/add-attendance')
  async addEmployeeAttenadance (
    @Body(CustomValidationPipe) employee: AddAttendanceDTO
  ){
    const service = await this.service.addAttedance(employee)

    return{
        success: true,
        message: 'Successfully added attendance for employee'
    }
  }
}
