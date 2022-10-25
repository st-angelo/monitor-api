import TransactionDto from '../../data/dto/transactionDto';
import prisma from '../../data/prisma';
import { AppError } from '../../utils/appError';
import { catchAsync } from '../../utils/catchAsync';
import { TypedRequest as Request } from '../common';
import { getTransactionOptions } from './common';
import { AddTransactionBody, UpdateTransactionBody } from './metadata';

export const getTransactions = catchAsync(async (req: Request<any, Record<string, string>>, res, next) => {
  const { filters, orderBy, skip, take } = getTransactionOptions(req.query);

  const [total, transactions] = await prisma.$transaction([
    prisma.transaction.count({ where: { userId: req.user.id, ...filters } }),
    prisma.transaction.findMany({
      include: { type: true, currency: true, category: true },
      where: { userId: req.user.id, ...filters },
      orderBy,
      skip,
      take,
    }),
  ]);

  res.status(200).json({
    total,
    values: transactions.map(transaction => new TransactionDto(transaction)),
  });
});

export const getTransaction = catchAsync(async (req: Request, res, next) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id },
    include: { type: true, currency: true, category: true },
  });

  if (!transaction) return next(new AppError(`Could not find transaction with id ${req.params.id}`, 404));

  res.status(200).json(new TransactionDto(transaction));
});

export const addTransaction = catchAsync(async (req: Request<AddTransactionBody>, res, next) => {
  const { typeId, amount, date, currencyId, categoryId, isRecurrent } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      typeId,
      amount,
      date: new Date(date),
      currencyId,
      categoryId,
      userId: req.user.id,
      isRecurrent,
    },
    include: {
      type: true,
      currency: true,
      category: true,
    },
  });

  res.status(200).json(new TransactionDto(transaction));
});

export const updateTransaction = catchAsync(async (req: Request<UpdateTransactionBody>, res, next) => {
  const { amount, date, currencyId, categoryId } = req.body;

  const transaction = await prisma.transaction.update({
    data: {
      amount,
      date,
      currencyId,
      categoryId,
      userId: req.user.id,
    },
    where: {
      id: req.params.id,
    },
    include: {
      type: true,
      currency: true,
      category: true,
    },
  });

  res.status(200).json(new TransactionDto(transaction));
});

export const deleteTransaction = catchAsync(async (req: Request, res, next) => {
  const transaction = await prisma.transaction.delete({
    where: {
      id: req.params.id,
    },
  });

  if (!transaction) return next(new AppError(`Could not delete transaction with id ${req.params.id}`, 404));

  res.status(204);
});
