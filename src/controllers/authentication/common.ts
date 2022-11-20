import { User, UserPreference } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, format } from 'date-fns';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserDto from '../../data/dto/userDto.js';
import { AppError } from '../../utils/appError.js';

export const signToken = ({
  id,
  name,
}: User): string =>
  jwt.sign(
    { id, name},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

export const createAndSendToken = (user: User & { UserPreference: UserPreference | null }, statusCode: number, res: Response) => {
  const token = signToken(user);

  res.cookie('jwt', token, {
    expires: addDays(Date.now(), process.env.JWT_COOKIE_EXPIRES_IN),
    secure: process.env.ENVIRONMENT === 'production',
    httpOnly: true,
  });

  res.status(statusCode).json(new UserDto(user));
};

export const userChangedPasswordAfter = (user: User, jwtTimestamp: number): boolean => {
  if (user.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(format(user.passwordChangedAt, 't'));
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

export const correctPassword = (value: string, currentPassword: string): Promise<boolean> => bcrypt.compare(value, currentPassword);

export const userNotFound = (next: NextFunction): void => next(new AppError('User not found', 404));
