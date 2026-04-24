import { OvertimeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLeaveRecordDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsEnum(OvertimeStatus)
  status: OvertimeStatus;
}
