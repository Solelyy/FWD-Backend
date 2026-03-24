import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma_global/prisma.module';
import { AdminModule } from './modules/admin/module/admin.module';
import { SuperadminModule } from './modules/superadmin/module/superadmin.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeeModule } from './modules/employee/employee.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //available globally
    }),
    PrismaModule,
    AdminModule,
    AuthModule,
    SuperadminModule,
    EmployeeModule,
    ScheduleModule.forRoot(),
  ], //bootstarp all modules
  controllers: [], //controllers
  providers: [], //services
})
export class AppModule {}
