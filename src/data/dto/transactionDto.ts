import { Category, Currency, Transaction, TransactionType } from '@prisma/client';
import CategoryDto from './categoryDto';
import CurrencyDto from './currencyDto';

class TransactionDto {
  id: string;
  typeId: string;
  amount: number;
  date: Date;
  currency: CurrencyDto;
  category: CategoryDto;
  isRecurrent?: boolean;

  constructor(
    transaction: Transaction & {
      type: TransactionType;
      currency: Currency;
      category: Category;
    }
  ) {
    this.id = transaction.id;
    this.typeId = transaction.type.id;
    this.amount = transaction.amount;
    this.date = transaction.date;
    this.currency = new CurrencyDto(transaction.currency);
    this.category = new CategoryDto(transaction.category);
    this.isRecurrent = transaction.isRecurrent;
  }
}

export default TransactionDto;
