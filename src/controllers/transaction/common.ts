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

export const getTransactionSortingOptions = (query: Record<string, string>) => {
  const { $orderBy, $direction } = query;
  const options: Record<string, string>[] = [];

  if ($orderBy) options.push({ [$orderBy]: $direction || 'asc' });

  return options;
};

export const getTransactionPaginationOptions = (query: Record<string, string>) => {
  const { $page, $size } = query;

  const options = {
    skip: (Number($page) - 1) * Number($size) || 0,
    take: Number($size) || 10,
  };

  return options;
};

export const getTransactionOptions = (query: Record<string, string>) => {
  const filters = getTransactionFilterOptions(query);
  const orderBy = getTransactionSortingOptions(query);
  const { skip, take } = getTransactionPaginationOptions(query);

  return { filters, orderBy, skip, take };
};
