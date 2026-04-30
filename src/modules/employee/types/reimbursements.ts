import { ReimbursementType } from '@prisma/client';

export type CreateReimbursement = {
  type: ReimbursementType;
  amountRequested: number;
  attachment: string;
  reason: string;
};
