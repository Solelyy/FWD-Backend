import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/module/auth.module';
import { DashboardService } from './service/dashboard.service';
import { UtilModule } from 'src/utils/util.module';
import { DashboardController } from './controlller/dashboard.controller';
import { AttendanceController } from './controlller/attendance.controller';
import { EmployeeAttendanceService } from './service/attendance.service';
import { ImageConfigs } from 'src/common/helper/image-base64';
import { LeaveService } from './leave/leave.service';
@Module({
  imports: [AuthModule, UtilModule],
  providers: [DashboardService, EmployeeAttendanceService, ImageConfigs, LeaveService],
  controllers: [DashboardController, AttendanceController],
  exports: [],
})
export class EmployeeModule {}
