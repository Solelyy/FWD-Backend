import { Request } from 'express';

// extend the shape to request
export interface RequestData extends Request {
  user?: {
    id: number;
    employeeId: string;
    email: string;
    role: string;
  };
}
