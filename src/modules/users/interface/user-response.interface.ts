export interface UserResponseInterface {
  id: number;
  firstname: string;
  lastname: string;
  employeeId: string;
  email: string;
  passwordHash: string;
  isVerified: false;
  verificationExpiration: Date;
}
