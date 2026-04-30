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
import { CashAdvanceController } from './controlller/cash-advance.controller';
import { CashAdvanceService } from './service/cash-advance.service';
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
    CashAdvanceService,
  ],
  controllers: [
    DashboardController,
    AttendanceController,
    LeaveController,
    CashAdvanceController,
  ],
  exports: [],
})
export class EmployeeModule {}
