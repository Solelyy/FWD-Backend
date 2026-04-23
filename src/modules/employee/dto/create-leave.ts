import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsDateString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { LeaveEnum } from '../types/create-leave';
import { IsAfter } from 'src/common/custom-validator/date.validation.fordto';

export class EmployeeLeaveDTO {
  @IsNotEmpty()
  @IsEnum(LeaveEnum)
  leaveType: LeaveEnum;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @IsAfter('startDate', {
    message: 'end date should be greater than the start date',
  })
  endDate: string;

  @MinLength(300, {
    message: 'Description too short',
  })
  @MaxLength(600, {
    message: 'Descriptions too long',
  })
  reason: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  attachment: string;
}
