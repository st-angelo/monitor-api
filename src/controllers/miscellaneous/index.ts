import prisma from '../../data/prisma';
import { catchAsync } from '../../utils/catchAsync';

export const getImplicitValues = catchAsync(async (req, res, next) => {
  const [implicitTransactionType, implicitCurrency] = await prisma.$transaction([
    prisma.transactionType.findFirst({ where: { implicit: true }, select: { id: true } }),
    prisma.currency.findFirst({ where: { implicit: true }, select: { id: true } }),
  ]);

  res.status(200).json({
    transactionTypeId: implicitTransactionType?.id,
    currencyId: implicitCurrency?.id,
  });
});
