import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum AllowedEmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class EmployeeStatusDTO {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(AllowedEmployeeStatus)
  status: AllowedEmployeeStatus;
}
