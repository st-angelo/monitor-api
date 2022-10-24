import { getPaginationOptions, getSortingOptions } from '../common';

export const getTransactionFilterOptions = (query: Record<string, string>) => {
  const { type, dateFrom, dateTo, category, currency, amountFrom, amountTo, isRecurrent } = query;
  const options: Record<string, unknown> = {};
  console.log(query);
  if (type) options.type = type;
  if (dateFrom) options.AND = [{ date: { gte: new Date(dateFrom) } }];
  if (dateTo) options.AND = [...((options.AND as unknown[]) || []), { date: { lte: new Date(dateTo) } }];
  if (currency) options.currency = currency;
  if (category) options.categoryId = category;
  if (amountFrom) options.AND = [...((options.AND as unknown[]) || []), { amount: { gte: parseFloat(amountFrom) } }];
  if (amountTo) options.AND = [...((options.AND as unknown[]) || []), { amount: { lte: parseFloat(amountTo) } }];
  if (isRecurrent) options.isRecurrent = JSON.parse(isRecurrent);

  return options;
};

export const getTransactionOptions = (query: Record<string, string>) => {
  const filters = getTransactionFilterOptions(query);
  const orderBy = getSortingOptions(query);
  const { skip, take } = getPaginationOptions(query);

  return { filters, orderBy, skip, take };
};
