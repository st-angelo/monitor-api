import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextFunction, Response } from 'express';
import CategoryDto from '../../data/dto/categoryDto';
import UserDto from '../../data/dto/userDto';
import prisma from '../../data/prisma';
import { uploadAvatar } from '../../services/cloudinaryService';
import { sendVerifyEmail } from '../../services/emailService';
import { AppError } from '../../utils/appError';
import cache, { CacheKeyPrefix } from '../../utils/cache';
import { catchAsync } from '../../utils/catchAsync';
import { correctPassword, createAndSendToken } from '../authentication/common';
import { TypedRequest as Request } from '../common';
import { getCategoryOptions } from './common';
import { AddCategoryBody, UpdateAccountData, UpdateCategoryBody, UpdatePasswordBody, VerifyUserParams } from './metadata';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(new UserDto(req.user));
};

export const verify = catchAsync(async (req: Request<any, VerifyUserParams>, res, next) => {
  const { email, token } = req.query;

  const verifyToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({ where: { email, verifyToken }, select: { isVerified: true } });
  if (!user) return next(new AppError('This user cannot be verified. Please contact our support.', 404));

  if (!user.isVerified) {
    await prisma.user.update({
      data: {
        isVerified: true,
        verifyToken: null,
      },
      where: {
        email,
      },
    });
  }

  res.redirect(process.env.CLIENT_URL);
});

export const updatePassword = catchAsync(async (req: Request<UpdatePasswordBody>, res, next) => {
  // 1. Get user from collection
  const user = await prisma.user.findFirst({ where: { id: req.user.id }, include: { UserPreference: true } });
  if (!user) return next(new AppError('User could not be found', 401));

  // 2. Check if POSTed password is correct
  if (!(await correctPassword(req.body.currentPassword, user.password))) return next(new AppError('Your current password is wrong', 401));

  // 3. If so, update password
  await prisma.user.update({
    data: {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: new Date(),
    },
    where: {
      id: user.id,
    },
  });

  // 4. Log in user, send JWT
  createAndSendToken(user, 200, res);
});

export const updateAccountData = catchAsync(async (req: Request<UpdateAccountData>, res, next) => {
  const { email, name, nickname, baseCurrencyId } = req.body;

  let avatarUrl = req.user.avatarUrl;
  if (req.file) {
    avatarUrl = await uploadAvatar(req.file);
  }

  let isVerified = req.user.isVerified;
  let verifyToken = null;
  if (email) {
    isVerified = false;
    verifyToken = crypto.randomBytes(32).toString('hex');
  }

  const user = await prisma.user.update({
    data: {
      email,
      name,
      nickname,
      avatarUrl,
      isVerified,
      verifyToken,
      UserPreference: { update: { baseCurrencyId } },
    },
    where: {
      id: req.user.id,
    },
  });

  if (email && verifyToken) {
    await sendVerifyEmail(user, verifyToken, `${req.protocol}://${req.get('host')}`);
  }

  res.status(200).json({ status: 'success' });
});

// #region Category

export const getCategories = catchAsync(async (req: Request<any, Record<string, string>>, res, next) => {
  const { filters, orderBy, skip, take } = getCategoryOptions(req.query);

  const [total, categories] = await prisma.$transaction([
    prisma.category.count({ where: { userId: req.user.id, ...filters } }),
    prisma.category.findMany({ where: { userId: req.user.id, ...filters }, orderBy, skip, take }),
  ]);

  res.status(200).json({
    total,
    values: categories.map(category => new CategoryDto(category)),
  });
});

export const getCategory = catchAsync(async (req, res, next) => {
  const category = await prisma.category.findFirst({ where: { id: req.params.id } });

  if (!category) return next(new AppError(`Could not find category with id ${req.params.id}`, 404));

  res.status(200).json(new CategoryDto(category));
});

export const addCategory = catchAsync(async (req: Request<AddCategoryBody>, res, next) => {
  const { name, description, color, transactionTypeId } = req.body;

  const category = await prisma.category.create({
    data: {
      name,
      description,
      color,
      transactionTypeId,
      userId: req.user.id,
    },
  });

  cache.del(`${CacheKeyPrefix.UserCategories}_${req.user.id}`);

  res.status(200).json(new CategoryDto(category));
});

export const updateCategory = catchAsync(async (req: Request<UpdateCategoryBody>, res, next) => {
  const { name, description, color } = req.body;

  const category = await prisma.category.update({
    data: {
      name,
      description,
      color,
    },
    where: {
      id: req.params.id,
    },
  });

  cache.del(`${CacheKeyPrefix.UserCategories}_${req.user.id}`);

  res.status(200).json(new CategoryDto(category));
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const [, category] = await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { categoryId: req.params.id } }),
    prisma.category.delete({ where: { id: req.params.id } }),
  ]);

  res.status(200).json(new CategoryDto(category));
});

// #endregion
