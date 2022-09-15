import { TransactionType } from '@prisma/client';

export interface AddTransactionBody {
  type: TransactionType;
  amount: number;
  date: Date;
  currency: string;
  categoryId: string;
  isRecurrent?: boolean;
}

export interface UpdateTransactionBody {
  amount: number;
  date: Date;
  currency: string;
  categoryId: string;
  isRecurrent?: boolean;
}
