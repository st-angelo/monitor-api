import { Currency, Transaction } from '@prisma/client';
import { AppError } from '../utils/appError';
import currencyService from './currencyService';

const getTransactionsForSummary = async (transactions: (Transaction & { currency: Currency })[], baseCurrencyCode?: string) => {
  if (!baseCurrencyCode) throw new AppError('Base currency id is missing!', 500);
  const result = [];
  for (const { id, typeId, amount, date, categoryId, currency } of transactions) {
    const baseValue = await currencyService.getConvertedValue(date, amount, currency.code, baseCurrencyCode);
    result.push({
      id,
      typeId,
      amount: baseValue,
      date,
      currencyCode: baseCurrencyCode,
      categoryId,
    });
  }
  return result;
};

export default { getTransactionsForSummary };