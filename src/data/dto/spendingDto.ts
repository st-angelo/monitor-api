import { Category, Spending } from '@prisma/client';
import CategoryDto from './categoryDto';

class SpendingDto {
  id: string;
  amount: number;
  date: Date;
  currency: string;
  category?: CategoryDto;

  constructor(
    spending: Spending & {
      category?: Category;
    }
  ) {
    this.id = spending.id;
    this.amount = spending.amount;
    this.date = spending.date;
    this.currency = spending.currency;
    this.category = spending.category && new CategoryDto(spending.category);
  }
}

export default SpendingDto;
