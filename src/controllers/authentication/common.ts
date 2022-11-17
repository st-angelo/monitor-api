import { User, UserPreference } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { format } from 'date-fns';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserDto from '../../data/dto/userDto.js';
import { AppError } from '../../utils/appError.js';

export const signToken = ({
  id,
  name,
  nickname,
  email,
  avatarUrl,
  UserPreference,
}: User & { UserPreference: UserPreference | null }): string =>
  jwt.sign(
    { id, name, nickname, email, avatarUrl, preferences: { baseCurrencyId: UserPreference?.baseCurrencyId } },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

export const createAndSendToken = (user: User & { UserPreference: UserPreference | null }, statusCode: number, res: Response) => {
  const token = signToken(user);
  res.status(statusCode).json({
    token,
    user: new UserDto(user),
  });
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
