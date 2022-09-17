export const getCategoryFilterOptions = (query: Record<string, string>) => {
  const { name  } = query;
  const options: Record<string, unknown> = {};

  if (name) options.name = { contains: name };

  return options;
};