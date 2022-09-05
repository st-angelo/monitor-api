import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongoose';
import { Currency } from '../constants';

class Spending {
  _id: ObjectId;
  userId: ObjectId;

  @AutoMap()
  amount: number;

  @AutoMap()
  date: Date;

  @AutoMap()
  currency: Currency;

  categoryId: ObjectId;
}

export default Spending;
