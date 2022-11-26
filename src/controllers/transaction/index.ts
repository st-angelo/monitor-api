import { startOfDay } from 'date-fns';
import TransactionDto from '../../data/dto/transactionDto';
import prisma from '../../data/prisma';
import transactionService from '../../services/transactionService';
import { AppError } from '../../utils/appError';
import { catchAsync } from '../../utils/catchAsync';
import { TypedRequest as Request } from '../common';
import { getTransactionFilterOptions, getTransactionOptions } from './common';
import { AddTransactionBody, DeleteTransactionsBody, UpdateTransactionBody } from './metadata';

export const getTransactions = catchAsync(async (req: Request<any, Record<string, string>>, res, next) => {
  const { filters, orderBy, skip, take } = getTransactionOptions(req.query);

  const [total, transactions] = await prisma.$transaction([
    prisma.transaction.count({ where: { userId: req.user.id, ...filters } }),
    prisma.transaction.findMany({
      include: { currency: true, category: true },
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

export const getTransactionsForSummary = catchAsync(async (req: Request<any, Record<string, string>>, res, next) => {
  const userPreference = await prisma.userPreference.findUnique({ where: { userId: req.user.id }, include: { baseCurrency: true } });
  let baseCurrency = userPreference?.baseCurrency || null;
  if (!baseCurrency) {
    const implicitCurrency = await prisma.currency.findFirst({ where: { implicit: true } });
    baseCurrency = implicitCurrency;
  }

  const filters = getTransactionFilterOptions(req.query);

  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.id, ...filters },
    include: { currency: true },
  });

  res.status(200).json(await transactionService.getTransactionsForSummary(transactions, baseCurrency?.code));
});

export const getLatestTransactionData = catchAsync(async (req, res, next) => {
  const [lastTransactions, topCategories] = await prisma.$transaction([
    prisma.transaction.findMany({ where: { userId: req.user.id }, orderBy: { added: 'desc' }, take: 3 }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: 'desc' } },
      where: { userId: req.user.id },
      take: 3,
    }),
  ]);

  res.status(200).json({
    lastTransactions: lastTransactions.map(transaction => new TransactionDto(transaction)),
    topCategories: topCategories.map(({ categoryId, _count }) => ({
      categoryId,
      count: (_count as Exclude<typeof _count, true>)?.categoryId,
    })),
  });
});

export const getTransaction = catchAsync(async (req: Request, res, next) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id },
    include: { currency: true, category: true },
  });

  if (!transaction) return next(new AppError(`Could not find transaction with id ${req.params.id}`, 404));

  res.status(200).json(new TransactionDto(transaction));
});

export const addTransaction = catchAsync(async (req: Request<AddTransactionBody>, res, next) => {
  const { typeId, amount, date, currencyId, categoryId, recurrence } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      typeId,
      amount,
      date: startOfDay(new Date(date)),
      currencyId,
      categoryId,
      userId: req.user.id,
      recurrence,
    },
    include: {
      currency: true,
      category: true,
    },
  });

  res.status(200).json(new TransactionDto(transaction));
});

export const updateTransaction = catchAsync(async (req: Request<UpdateTransactionBody>, res, next) => {
  const { amount, date, currencyId, categoryId, recurrence } = req.body;

  const transaction = await prisma.transaction.update({
    data: {
      amount,
      date: startOfDay(new Date(date)),
      currencyId,
      categoryId,
      recurrence,
    },
    where: {
      id: req.params.id,
    },
    include: {
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

  res.status(200).json({ status: 'success' });
});

export const deleteTransactions = catchAsync(async (req: Request<DeleteTransactionsBody>, res, next) => {
  const { ids } = req.body;

  const deleted = await prisma.transaction.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (deleted.count !== ids.length) return next(new AppError('Could not delete transaction(s).', 404));

  res.status(200).json({ status: 'success' });
});
