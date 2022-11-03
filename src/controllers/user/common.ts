import { getPaginationOptions, getSortingOptions } from '../common';

export const getCategoryFilterOptions = (query: Record<string, string>) => {
  const { name, description, transactionTypeId } = query;
  const options: Record<string, unknown> = {};

  if (name) options.name = { contains: name };
  if (description) options.description = { contains: description };
  if (transactionTypeId) options.transactionTypeId = transactionTypeId;

  return options;
};

export const getCategoryOptions = (query: Record<string, string>) => {
  const filters = getCategoryFilterOptions(query);
  const orderBy = getSortingOptions(query);
  const { skip, take } = getPaginationOptions(query);

  return { filters, orderBy, skip, take };
};
