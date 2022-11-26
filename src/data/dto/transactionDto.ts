import { Category, Currency, Recurrence, Transaction } from '@prisma/client';
import CategoryDto from './categoryDto';
import CurrencyDto from './currencyDto';

class TransactionDto {
  id: string;
  typeId: string;
  amount: number;
  date: Date;
  currencyId: string;
  currency?: CurrencyDto;
  categoryId: string;
  category?: CategoryDto;
  recurrence?: Recurrence;

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
    this.currencyId = transaction.currencyId;
    this.currency = transaction.currency && new CurrencyDto(transaction.currency);
    this.categoryId = transaction.categoryId;
    this.category = transaction.category && new CategoryDto(transaction.category);
    this.recurrence = transaction.recurrence ?? undefined;
  }
}

export default TransactionDto;
