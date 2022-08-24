import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongoose';

class UserDto {
  id: ObjectId;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  photo: string;
}

export default UserDto;
