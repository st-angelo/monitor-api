import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
import { UserRole as roles } from '../constants.js';
import User from '../entities/user.js';

type UserDocument = User & mongoose.Document;

const userSchema = new mongoose.Schema<User>({
  firstName: {
    type: String,
    required: [true, 'A first name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'A last name is required'],
  },
  email: {
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, 'Provided email is invalid'],
  },
  photo: String,
  role: {
    type: String,
    enum: Object.keys(roles),
    default: roles.User,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

/* Encrypt 'password' before saving if password was modified */
userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* Modify 'passwordChangedAt' before saving if 'password' was changed */
userSchema.pre<UserDocument>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date();
  next();
});

/* Filter out inactive users */
userSchema.pre<mongoose.Query<User, mongoose.Document<User>>>(
  /^find/,
  function (next) {
    void this.find({ active: { $ne: false } });
    next();
  }
);

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
