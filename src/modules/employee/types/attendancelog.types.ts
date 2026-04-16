import { attendance_Status } from '@prisma/client';

export type EmployeeAttendanceLog = {
  logs: {
    id: number;
    date: Date;
    timeIn: {
      timestamp: Date;
    };
    timeOut: {
      timestamp: Date;
    };
    status: attendance_Status;
    totalHours: number | null;
  }[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
