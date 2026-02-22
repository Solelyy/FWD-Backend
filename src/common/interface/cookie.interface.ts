import { Role } from '@prisma/client';

export interface CookieInterfaceLogin {
  employeeId: string;
  role: Role;
}
