export interface AddSpendingBody {
  amount: number;
  date: Date;
  currency: string;
  categoryId: string;
}

export interface UpdateSpendingBody {
  amount: number;
  date: Date;
  currency: string;
  categoryId: string;
}
