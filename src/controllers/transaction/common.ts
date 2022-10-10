import { getPaginationOptions, getSortingOptions } from '../common';

export const getTransactionFilterOptions = (query: Record<string, string>) => {
  const { type, currency, categoryId, isRecurrent, startDate, endDate } = query;
  const options: Record<string, unknown> = {};

  if (type) options.type = type;
  if (currency) options.currency = currency;
  if (categoryId) options.categoryId = categoryId;
  if (isRecurrent) options.isRecurrent = JSON.parse(isRecurrent);
  if (startDate) options.AND = [{ date: { gte: new Date(startDate) } }];
  if (endDate) options.AND = [...((options.AND as unknown[]) || []), { date: { lte: new Date(endDate) } }];

  return options;
};

export const getTransactionOptions = (query: Record<string, string>) => {
  const filters = getTransactionFilterOptions(query);
  const orderBy = getSortingOptions(query);
  const { skip, take } = getPaginationOptions(query);

  return { filters, orderBy, skip, take };
};
