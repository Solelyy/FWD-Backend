import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma_global/prisma.module';
import { UsersModule } from './users/module/users.module';
import { UtilModule } from './utils/security/utils.module';
import { SuperadminModule } from './superadmin/module/superadmin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //available globally
    }),
    PrismaModule,
    UsersModule,
    UtilModule,
    SuperadminModule,
  ], //bootstarp all modules
  controllers: [], //controllers
  providers: [], //services
})
export class AppModule {}
