import { Module } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { AdminController } from '../controller/users.controller';
import { AuthModule } from 'src/modules/auth/module/auth.module';
import { UtilModule } from 'src/utils/util.module';
import { EmailModule } from 'src/email/module/email.module';
import { ManagementServiceFeature } from '../service/management.service';
import { ManagementControllerFeature } from '../controller/management.controller';
import { ExternalService } from '../service/external-admin.service';
import { ExternalAdminController } from '../controller/external.admin.controller';
import { AdminAttendanceService } from '../service/attendance.service';
import { AdminAttendanceController } from '../controller/attendance.controller';
import { DateHelper } from 'src/utils/date.utils';
import { AdminLeaveController } from '../controller/leave.controller';
import { AdminLeaveService } from '../service/leave.service';
import { LeaveHelper } from 'src/common/helper/leave-helper';
import { AdminCashAdvanceService } from '../service/cash-advance.service';
import { AdminCashAdvanceController } from '../controller/cash-advance.controller';
import { AdminReimbursementController } from '../controller/reimbursement.controller';
import { AdminReimbursementService } from '../service/reimbursement.service';
@Module({
  imports: [AuthModule, UtilModule, EmailModule],
  controllers: [
    AdminController,
    ManagementControllerFeature,
    ExternalAdminController,
    AdminAttendanceController,
    AdminLeaveController,
    AdminCashAdvanceController,
    AdminReimbursementController,
  ],
  providers: [
    AdminService,
    ManagementServiceFeature,
    ExternalService,
    AdminAttendanceService,
    DateHelper,
    AdminLeaveService,
    LeaveHelper,
    AdminCashAdvanceService,
    AdminReimbursementService,
  ],
})
export class AdminModule {}
