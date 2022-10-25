export interface  AddTransactionBody {
  typeId: string;
  amount: number;
  date: Date;
  currencyId: string;
  categoryId: string;
  isRecurrent?: boolean;
}

export interface UpdateTransactionBody {
  amount: number;
  date: Date;
  currencyId: string;
  categoryId: string;
  isRecurrent?: boolean;
}
