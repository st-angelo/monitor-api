export interface AddTransactionBody {
  typeId: string;
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
