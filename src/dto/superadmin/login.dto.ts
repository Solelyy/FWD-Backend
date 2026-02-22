import { Role } from '@prisma/client';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginSuperAdminDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsString()
  passwordHash: string;
}
