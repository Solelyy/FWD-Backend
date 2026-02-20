import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma_global/prisma.module';
import { UsersModule } from './users/module/users.module';
import { UtilModule } from './utils/security/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //available globally
    }),
    PrismaModule,
    UsersModule,
    UtilModule,
  ], //bootstarp all modules
  controllers: [], //controllers
  providers: [], //services
})
export class AppModule {}
