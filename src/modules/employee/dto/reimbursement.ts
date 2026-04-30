import { ReimbursementType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReimbursementDTO {
  @IsEnum(ReimbursementType)
  @IsNotEmpty()
  type: ReimbursementType;

  @IsNotEmpty()
  @Min(500)
  @Max(20000)
  amountRequested: number;

  @IsOptional()
  @IsString()
  attachment: string;

  @IsOptional()
  @IsString()
  reason: string;
}
