import amClasses from '@automapper/classes';
import { ObjectId } from 'mongoose';
import { UserRole } from '../constants.js';

class User {
  _id: ObjectId;

  @amClasses.AutoMap()
  firstName: string;

  @amClasses.AutoMap()
  lastName: string;

  @amClasses.AutoMap()
  email: string;

  @amClasses.AutoMap()
  photo: string;

  role: UserRole;
  active: boolean;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
}

export default User;
