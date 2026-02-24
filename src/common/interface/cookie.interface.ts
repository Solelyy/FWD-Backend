import { Role } from '@prisma/client';

//only the not suspicious attributes for parsing cookie
export interface CookieData {
  employeeId: string;
  role: Role;
}
