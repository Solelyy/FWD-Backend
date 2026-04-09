import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/module/auth.module';
import { DashboardService } from './service/dashboard.service';
import { UtilModule } from 'src/utils/util.module';
import { DashboardController } from './controlller/dashboard.controller';
@Module({
  imports: [AuthModule, UtilModule],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [],
})
export class EmployeeModule {}
