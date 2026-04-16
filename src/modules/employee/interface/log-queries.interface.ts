// attendance.dto.ts
import { Type } from 'class-transformer';

export class AttendanceLogsQueries {
  @Type(() => Number) // ← This is like ParseIntPipe for DTOs
  page: number;

  @Type(() => Number)
  limit: number;

  @Type(() => Number)
  year: number;

  @Type(() => Number)
  month: number;
}
