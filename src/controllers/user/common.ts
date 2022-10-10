import { getPaginationOptions, getSortingOptions } from '../common';

export const getCategoryFilterOptions = (query: Record<string, string>) => {
  const { name } = query;
  const options: Record<string, unknown> = {};

  if (name) options.name = { contains: name };

  return options;
};

export const getCategoryOptions = (query: Record<string, string>) => {
  const filters = getCategoryFilterOptions(query);
  const orderBy = getSortingOptions(query);
  const { skip, take } = getPaginationOptions(query);

  return { filters, orderBy, skip, take };
};
