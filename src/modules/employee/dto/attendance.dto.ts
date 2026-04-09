import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsDate,
  IsDateString,
} from 'class-validator';
import { attendance_Status } from '@prisma/client';
export class AttendanceDTO {
  @IsNotEmpty()
  @IsString()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  @IsString()
  timeStamp: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsEnum(attendance_Status)
  attendanceType: attendance_Status;

  @IsNotEmpty()
  @IsBoolean()
  isOvertime: boolean;
}
