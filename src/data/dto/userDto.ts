import amClasses from '@automapper/classes';
import { ObjectId } from 'mongoose';

class UserDto {
  id: ObjectId;

  @amClasses.AutoMap()
  firstName: string;

  @amClasses.AutoMap()
  lastName: string;

  @amClasses.AutoMap()
  email: string;

  @amClasses.AutoMap()
  photo: string;
}

export default UserDto;
