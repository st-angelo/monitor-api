import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongoose';
import { UserRole } from '../constants.js';

class User {
  _id: ObjectId;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  photo: string;

  role: UserRole;
  active: boolean;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
}

export default User;
