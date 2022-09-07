import SpendingDto from '../../data/dto/spendingDto';
import prisma from '../../data/prisma';
import { AppError } from '../../utils/appError';
import { catchAsync } from '../../utils/catchAsync';
import { TypedRequest as Request } from '../common';
import { AddSpendingBody, UpdateSpendingBody } from './metadata';

export const getSpendings = catchAsync(async (req: Request, res, next) => {
  const spendings = await prisma.spending.findMany({ where: { userId: req.user.id } });

  res.status(200).json({
    success: true,
    data: spendings.map(spending => new SpendingDto(spending)),
  });
});

export const getSpending = catchAsync(async (req: Request, res, next) => {
  const spending = await prisma.spending.findFirst({ where: { id: req.params.id }, include: { category: true } });

  if (!spending) return next(new AppError(`Could not find spending with id ${req.params.id}`, 404));

  res.status(200).json({
    success: true,
    data: new SpendingDto(spending),
  });
});

export const addSpending = catchAsync(async (req: Request<AddSpendingBody>, res, next) => {
  const { amount, date, currency, categoryId } = req.body;

  const spending = await prisma.spending.create({
    data: {
      amount,
      date: new Date(date),
      currency,
      categoryId,
      userId: req.user.id,
    },
    include: {
      category: true,
    },
  });

  res.status(200).json({
    success: true,
    data: new SpendingDto(spending),
  });
});

export const updateSpending = catchAsync(async (req: Request<UpdateSpendingBody>, res, next) => {
  const { amount, date, currency, categoryId } = req.body;

  const spending = await prisma.spending.update({
    data: {
      amount,
      date,
      currency,
      categoryId,
      userId: req.user.id,
    },
    where: {
      id: req.params.id,
    },
    include: {
      category: true,
    },
  });

  res.status(200).json({
    success: true,
    data: new SpendingDto(spending),
  });
});

export const deleteSpending = catchAsync(async (req: Request, res, next) => {
  await prisma.spending.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(204);
});
