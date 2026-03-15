import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum AllowedAdminStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class AdminStatusDTO {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(AllowedAdminStatus)
  status: AllowedAdminStatus;
}
