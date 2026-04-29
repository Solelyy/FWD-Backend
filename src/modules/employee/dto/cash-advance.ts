import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCashAdvanceDTO {
  @IsNotEmpty()
  @Min(500)
  @Max(20000)
  amountRequested: number;

  @IsOptional()
  @IsString()
  reason: string;
}
