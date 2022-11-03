import { Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export interface TypedRequest<TReqBody = any, TQuery = Query, TParams = ParamsDictionary> extends Request<TParams, any, TReqBody, TQuery> {
  body: TReqBody;
  query: TQuery;
  params: TParams;
}

export const getSortingOptions = (query: Record<string, string>) => {
  const { $orderBy, $direction } = query;
  const options: Record<string, string>[] = [];

  if ($orderBy) options.push({ [$orderBy]: $direction || 'asc' });
  options.push({ id: 'desc' });

  return options;
};

export const getPaginationOptions = (query: Record<string, string>) => {
  const { $page, $size } = query;

  const options = {
    skip: (Number($page) - 1) * Number($size) || 0,
    take: Number($size) || 10,
  };

  return options;
};
