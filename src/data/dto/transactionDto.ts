import { Category, Transaction, TransactionType } from '@prisma/client';
import CategoryDto from './categoryDto';

class TransactionDto {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  currency: string;
  category?: CategoryDto;
  userId: string;
  isRecurrent?: boolean;

  constructor(
    transaction: Transaction & {
      category?: Category;
    }
  ) {
    this.id = transaction.id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.date = transaction.date;
    this.currency = transaction.currency;
    this.category = transaction.category && new CategoryDto(transaction.category);
    this.userId = transaction.userId;
    this.isRecurrent = transaction.isRecurrent;
  }
}

export default TransactionDto;
