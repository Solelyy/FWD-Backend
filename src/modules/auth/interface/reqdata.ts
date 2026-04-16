import { Request } from 'express';

// extend the shape to request to inhert
// same = extends, diff = implements
export interface RequestData extends Request {
  user?: {
    id: number;
    employeeId: string;
    email: string;
    role: string;
  };
}
