import { Module } from '@nestjs/common';
import { SuperadminService } from '../service/superadmin.service';
import { SuperadminController } from '../controller/superadmin.controller';

@Module({
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {}
