import { Category, Currency, Recurrence, Transaction } from '@prisma/client';
import CategoryDto from './categoryDto';
import CurrencyDto from './currencyDto';

class TransactionDto {
  id: string;
  typeId: string;
  amount: number;
  date: Date;
  description: string | null;
  currencyId: string;
  currency?: CurrencyDto;
  categoryId: string;
  category?: CategoryDto;
  recurrence: Recurrence | null;
  propagated: boolean | null;
  sourceId: string | null;

  constructor(
    transaction: Transaction & {
      currency?: Currency;
      category?: Category;
    }
  ) {
    this.id = transaction.id;
    this.typeId = transaction.typeId;
    this.amount = transaction.amount;
    this.date = transaction.date;
    this.description = transaction.description;
    this.currencyId = transaction.currencyId;
    this.currency = transaction.currency && new CurrencyDto(transaction.currency);
    this.categoryId = transaction.categoryId;
    this.category = transaction.category && new CategoryDto(transaction.category);
    this.recurrence = transaction.recurrence;
    this.propagated = transaction.propagated;
    this.sourceId = transaction.sourceId;
  }
}

export default TransactionDto;
