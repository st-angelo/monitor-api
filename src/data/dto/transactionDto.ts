import { Category, Currency, Transaction } from '@prisma/client';
import CategoryDto from './categoryDto';
import CurrencyDto from './currencyDto';

class TransactionDto {
  id: string;
  typeId: string;
  amount: number;
  date: Date;
  currency?: CurrencyDto;
  category?: CategoryDto;
  isRecurrent?: boolean;

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
    this.currency = transaction.currency && new CurrencyDto(transaction.currency);
    this.category = transaction.category && new CategoryDto(transaction.category);
    this.isRecurrent = transaction.isRecurrent;
  }
}

export default TransactionDto;
