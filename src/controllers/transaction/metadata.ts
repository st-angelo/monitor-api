import { Recurrence } from "@prisma/client";

export interface AddTransactionBody {
  typeId: string;
  amount: number;
  date: string;
  currencyId: string;
  categoryId: string;
  recurrence?: Recurrence;
}

export interface UpdateTransactionBody {
  amount: number;
  date: string;
  currencyId: string;
  categoryId: string;
  recurrence?: Recurrence;
}

export interface DeleteTransactionsBody {
  ids: string[];
}
