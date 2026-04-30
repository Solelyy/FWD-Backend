import { OvertimeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CashAdvanceStatus } from '@prisma/client';
export class UpdateReimbursementDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsEnum(CashAdvanceStatus)
  status: CashAdvanceStatus;
}
