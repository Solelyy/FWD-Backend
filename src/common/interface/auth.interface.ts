import { Role } from '@prisma/client';

type Subtypes = number | string;

export interface VerificationTokenPayload {
  email: string;
  sub: Subtypes;
  iat?: number;
  exp?: number;
  role: Role;
}
