import CategoryDto from '../../data/dto/categoryDto';
import CurrencyDto from '../../data/dto/currencyDto';
import prisma from '../../data/prisma';
import { catchAsync } from '../../utils/catchAsync';
import { TypedRequest as Request } from '../common';

export const getCategories = catchAsync(async (req: Request, res, next) => {
  const categories = await prisma.category.findMany({ where: { OR: [{ userId: req.user.id }, { userId: null }] } });

  res.status(200).json(categories.map(category => new CategoryDto(category)));
});

export const getCurrencies = catchAsync(async (req, res, next) => {
  const currencies = await prisma.currency.findMany({ where: { active: true } });

  res.status(200).json(currencies.map(currency => new CurrencyDto(currency)));
});
