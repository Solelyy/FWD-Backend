import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { IsAfter } from 'src/common/custom-validator/date.validation.fordto';
export enum AllowedAdminStatusSuspended {
  SUSPENDED = 'SUSPENDED',
}

export class EmployeeStatusSuspendedDTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(AllowedAdminStatusSuspended)
  status: AllowedAdminStatusSuspended;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @IsAfter('startDate', {
    message: 'end date should be greater than the start date',
  })
  endDate: string;
}
