import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongoose';

class CategoryDto {
  id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  color?: string;
}

export default CategoryDto;
