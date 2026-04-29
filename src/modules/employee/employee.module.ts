import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/module/auth.module';
import { DashboardService } from './service/dashboard.service';
import { UtilModule } from 'src/utils/util.module';
import { DashboardController } from './controlller/dashboard.controller';
import { AttendanceController } from './controlller/attendance.controller';
import { EmployeeAttendanceService } from './service/attendance.service';
import { ImageConfigs } from 'src/common/helper/image-base64';
import { LeaveService } from './service/leave.service';
import { QueryHelper } from 'src/common/queries/leave';
import { LeaveHelper } from 'src/common/helper/leave-helper';
import { AttendanceHelper } from 'src/common/helper/attendance-helper';
import { LeaveController } from './controlller/leave.controller';
@Module({
  imports: [AuthModule, UtilModule],
  providers: [
    DashboardService,
    EmployeeAttendanceService,
    ImageConfigs,
    LeaveService,
    QueryHelper,
    LeaveHelper,
    AttendanceHelper,
    LeaveService,
  ],
  controllers: [DashboardController, AttendanceController, LeaveController],
  exports: [],
})
export class EmployeeModule {}
