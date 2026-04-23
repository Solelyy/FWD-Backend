import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/module/auth.module';
import { DashboardService } from './service/dashboard.service';
import { UtilModule } from 'src/utils/util.module';
import { DashboardController } from './controlller/dashboard.controller';
import { AttendanceController } from './controlller/attendance.controller';
import { EmployeeAttendanceService } from './service/attendance.service';
import { ImageConfigs } from 'src/common/helper/image-base64';
import { LeaveService } from './service/leave.service';
import { LeaveQuery } from 'src/common/queries/leave';
import { LeaveHelper } from 'src/common/helper/bal-check';
@Module({
  imports: [AuthModule, UtilModule],
  providers: [
    DashboardService,
    EmployeeAttendanceService,
    ImageConfigs,
    LeaveService,
    LeaveQuery,
    LeaveHelper,
  ],
  controllers: [DashboardController, AttendanceController],
  exports: [],
})
export class EmployeeModule {}
