import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongoose';

class Category {
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  color?: string;

  userId?: ObjectId;
}

export default Category;
