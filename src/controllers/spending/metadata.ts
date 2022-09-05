import { Currency } from '../../data/constants';

export interface AddSpendingBody {
  amount: number;
  date: Date;
  currency: Currency;
  categoryId: string;
}

export interface UpdateSpendingBody {
  amount: number;
  date: Date;
  currency: Currency;
  categoryId: string;
}
