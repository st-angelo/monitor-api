import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongoose';
import { Currency } from '../constants';
import Category from '../entities/category';

class SpendingDto {
  id: ObjectId;

  @AutoMap()
  amount: number;

  @AutoMap()
  date: Date;

  @AutoMap()
  currency: Currency;

  @AutoMap()
  category: Category;
}

export default SpendingDto;
