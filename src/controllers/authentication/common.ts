import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { add, format } from 'date-fns';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import UserDto from '../../data/dto/userDto.js';
import User from '../../data/entities/user.js';
import { AppError } from '../../utils/appError.js';
import mapper from '../../utils/mapper.js';

export const signToken = (id: ObjectId): string =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const createAndSendToken = (
  user: User,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: mapper.map(user, User, UserDto),
    },
  });
};

export const userChangedPasswordAfter = (
  user: User,
  jwtTimestamp: number
): boolean => {
  if (user.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(
      format(user.passwordChangedAt, 't')
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

export const createPasswordResetToken = (user: User): string => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = add(Date.now(), { minutes: 10 });

  return resetToken;
};

export const correctPassword = (
  value: string,
  currentPassword: string
): Promise<boolean> => bcrypt.compare(value, currentPassword);

export const userNotFound = (next: NextFunction): void =>
  next(new AppError('User not found', 404));
