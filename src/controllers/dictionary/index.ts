import { Category, Currency, TransactionType } from '@prisma/client';
import CategoryDto from '../../data/dto/categoryDto';
import CurrencyDto from '../../data/dto/currencyDto';
import TransactionTypeDto from '../../data/dto/transactionTypeDto';
import prisma from '../../data/prisma';
import cache, { CacheKeyPrefix } from '../../utils/cache';
import { catchAsync } from '../../utils/catchAsync';
import { TypedRequest as Request } from '../common';

export const getTransactionTypes = catchAsync(async (req, res, next) => {
  let transactionTypes = cache.get<TransactionType[]>(CacheKeyPrefix.TransactionTypes);

  if (!transactionTypes) {
    transactionTypes = await prisma.transactionType.findMany({ where: { active: true } });
    cache.set(CacheKeyPrefix.TransactionTypes, transactionTypes);
  }

  res.status(200).json(transactionTypes.map(transactionType => new TransactionTypeDto(transactionType)));
});

export const getCategories = catchAsync(async (req: Request, res, next) => {
  let categories = cache.get<Category[]>(`${CacheKeyPrefix.UserCategories}_${req.user.id}`);

  if (!categories) {
    categories = await prisma.category.findMany({ where: { OR: [{ userId: req.user.id }, { userId: null }] } });
    cache.set(`${CacheKeyPrefix.UserCategories}_${req.user.id}`, categories);
  }

  res.status(200).json(categories.map(category => new CategoryDto(category)));
});

export const getCurrencies = catchAsync(async (req, res, next) => {
  let currencies = cache.get<Currency[]>(CacheKeyPrefix.Currencies);

  if (!currencies) {
    currencies = await prisma.currency.findMany({ where: { active: true } });
    cache.set(CacheKeyPrefix.Currencies, currencies);
  }

  res.status(200).json(currencies.map(currency => new CurrencyDto(currency)));
});
