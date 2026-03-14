import { Module } from '@nestjs/common';
import { EmailService } from '../service/email.service';
import { UtilModule } from 'src/utils/util.module';

@Module({
  imports: [UtilModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
