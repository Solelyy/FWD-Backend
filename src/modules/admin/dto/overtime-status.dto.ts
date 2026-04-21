import { OvertimeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OvertimeStatusDTO {
  @IsNotEmpty()
  @IsNumber()
  attendanceId: number;
  // since utc is sent on frontend
  // its okay to use datestring, its compatible
  @IsNotEmpty()
  @IsString()
  status: string;
}
