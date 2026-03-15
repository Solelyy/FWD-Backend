import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export enum AllowedAdminStatusSuspended {
  SUSPENDED = 'SUSPENDED',
}

export class AdminStatusSuspendedDTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(AllowedAdminStatusSuspended)
  status: AllowedAdminStatusSuspended;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
