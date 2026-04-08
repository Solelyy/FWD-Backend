import { IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { attendance_Status } from '@prisma/client';
export class AttendanceDTO {
  @IsString()
  location?: string;

  @IsString()
  timeStamp: string;

  @IsString()
  imageUrl?: string;

  @IsEnum(attendance_Status)
  attendanceType: attendance_Status;

  @IsBoolean()
  isOvertime?: boolean;
}
