import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';

export class APIFeatures<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
  query:
    | mongoose.QueryWithHelpers<ResultType, DocType, THelpers, RawDocType>
    | mongoose.QueryWithHelpers<DocType[], DocType, THelpers, RawDocType>;
  queryParams: Query;

  constructor(query: mongoose.QueryWithHelpers<ResultType, DocType, THelpers, RawDocType>, queryParams: Query) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter() {
    const { sort, fields, page, limit, ...filters } = this.queryParams;

    const filtersStr = JSON.stringify(filters).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(filtersStr) as mongoose.FilterQuery<DocType>);

    return this;
  }

  sort() {
    // 2. Sorting
    const { sort } = this.queryParams;

    if (sort) this.query = this.query.sort((sort as string).split(',').join(' '));

    return this;
  }

  limitFields() {
    // 3. Field limiting
    const { fields } = this.queryParams;

    if (fields) this.query = this.query.select((fields as string).split(',').join(' '));
    else this.query = this.query.select('-__v');

    return this;
  }

  paginate() {
    // 4. Pagination
    const { page: queryPage, limit: queryLimit } = this.queryParams;

    const page = Number.parseInt(queryPage as string) || 1;
    const limit = Number.parseInt(queryLimit as string) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
