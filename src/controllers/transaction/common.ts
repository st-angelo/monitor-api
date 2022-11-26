import { getPaginationOptions, getSortingOptions } from '../common';

export const getTransactionFilterOptions = (query: Record<string, string>) => {
  const { dateFrom, dateTo, typeId, categoryId, currencyId, amountFrom, amountTo, isRecurrent } = query;
  const options: Record<string, unknown> = {};

  if (dateFrom) options.AND = [{ date: { gte: new Date(dateFrom) } }];
  if (dateTo) options.AND = [...((options.AND as unknown[]) || []), { date: { lte: new Date(dateTo) } }];
  if (typeId) options.typeId = typeId;
  if (categoryId) options.categoryId = categoryId;
  if (currencyId) options.currencyId = currencyId;
  if (amountFrom) options.AND = [...((options.AND as unknown[]) || []), { amount: { gte: parseFloat(amountFrom) } }];
  if (amountTo) options.AND = [...((options.AND as unknown[]) || []), { amount: { lte: parseFloat(amountTo) } }];
  if (isRecurrent && JSON.parse(isRecurrent)) options.AND = [...((options.AND as unknown[]) || []), { NOT: { recurrence: null } }];
  
  return options;
};

export const getTransactionOptions = (query: Record<string, string>) => {
  const filters = getTransactionFilterOptions(query);
  const orderBy = getSortingOptions(query);
  const { skip, take } = getPaginationOptions(query);

  return { filters, orderBy, skip, take };
};
