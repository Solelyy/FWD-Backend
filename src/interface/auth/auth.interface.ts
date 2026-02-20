export interface VerificationTokenPayload {
  email: string;
  sub: Number;
  iat?: number;
  exp?: number;
}
