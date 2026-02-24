import { Role } from '@prisma/client';

//only the not suspicious attributes for parsing cookie
export interface CookieInterfaceLogin {
  employeeId: string;
  role: Role;
}
