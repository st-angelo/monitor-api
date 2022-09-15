export const getPrismaTransactionFilters = (query: Record<string, string | undefined>) => {
  const { type, currency, categoryId, isRecurrent, startDate, endDate } = query;
  const prismaFilters: Record<string, unknown> = {};

  if (type) prismaFilters.type = type;
  if (currency) prismaFilters.currency = currency;
  if (categoryId) prismaFilters.categoryId = categoryId;
  if (isRecurrent) prismaFilters.isRecurrent = JSON.parse(isRecurrent);
  if (startDate) prismaFilters.AND = [{ date: { gte: new Date(startDate) } }];
  if (endDate) prismaFilters.AND = [...((prismaFilters.AND as unknown[]) || []), { date: { lte: new Date(endDate) } }];

  return prismaFilters;
};
