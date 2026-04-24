import { attendance_Status, OvertimeStatus } from '@prisma/client';

export function AttendanceFilterHelper(filter: string) {
  let statusFilter: attendance_Status | undefined;

  switch (filter) {
    case 'PRESENT':
      statusFilter = attendance_Status.COMPLETED;
      break;
    case 'ABSENT':
      statusFilter = attendance_Status.NO_RECORD;
      break;
    case 'ON_LEAVE':
      statusFilter = attendance_Status.ON_LEAVE;
      break;
    case 'OVERTIME_REQUEST':
      statusFilter = attendance_Status.OVERTIME_REQUEST;
      break;
    case 'MISSING_TIMEOUT':
      statusFilter = attendance_Status.MISSING_TIMEOUT;
      break;
    default:
      statusFilter = undefined;
  }

  return statusFilter;
}
