import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/module/auth.module';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controlller/dashboard.controller';
@Module({
  imports: [AuthModule],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [],
})
export class EmployeeModule {}
