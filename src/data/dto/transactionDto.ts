import { Category, Transaction, TransactionType } from '@prisma/client';
import CategoryDto from './categoryDto';

class TransactionDto {
  id: string;
  typeId: string;
  amount: number;
  date: Date;
  currency: string;
  category?: CategoryDto;
  isRecurrent?: boolean;

  constructor(
    transaction: Transaction & {
      type: TransactionType;
      category: Category;
    }
  ) {
    this.id = transaction.id;
    this.typeId = transaction.type.id;
    this.amount = transaction.amount;
    this.date = transaction.date;
    this.currency = transaction.currency;
    this.category = transaction.category && new CategoryDto(transaction.category);
    this.isRecurrent = transaction.isRecurrent;
  }
}

export default TransactionDto;
