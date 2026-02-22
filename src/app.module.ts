import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma_global/prisma.module';
import { UsersModule } from './modules/users/module/users.module';
import { SuperadminModule } from './modules/superadmin/module/superadmin.module';
import { AuthModule } from './modules/auth/module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //available globally
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SuperadminModule,
  ], //bootstarp all modules
  controllers: [], //controllers
  providers: [], //services
})
export class AppModule {}
