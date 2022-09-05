import { ClientSession } from 'mongodb';
import mongoose from 'mongoose';
import { APIFeatures } from '../utils/apiFeatures';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { TypedRequest as Request } from './common';

const getAll = <TModel>(Model: mongoose.Model<TModel>, includeUser = true) =>
  catchAsync(async (req, res, next) => {
    // Remove user from client query
    req.query.userId = undefined;
    if (includeUser) {
      if (!req.user) return next(new AppError('Could not create entry. User not found!', 404));
      req.query.userId = String(req.user._id);
    }

    const features = new APIFeatures(Model.find(), req.query).filter().sort().limitFields().paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      data: docs,
    });
  });

const getOne = <TModel>(Model: mongoose.Model<TModel>, populateOpt?: Record<string, string>) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    const query = Model.findById(req.params.id);
    if (populateOpt) void query.populate(populateOpt);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${modelName} found with the Id {${req.params.id}}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

const createOne = <TModel, TRequestBody>(Model: mongoose.Model<TModel>, includeUser: boolean = true) =>
  catchAsync(async (req: Request<TRequestBody>, res, next) => {
    const auxiliaryFields: Record<string, any> = {};
    if (includeUser) {
      if (!req.user) return next(new AppError('Could not create entry. User not found!', 404));
      auxiliaryFields.userId = req.user?._id;
    }

    const doc = await Model.create({ ...req.body, ...auxiliaryFields });
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

const updateOne = <TModel, TRequestBody>(Model: mongoose.Model<TModel>, includeUser: boolean = true) =>
  catchAsync(async (req: Request<TRequestBody>, res, next) => {
    const auxiliaryFields: Record<string, any> = {};
    if (includeUser) {
      if (!req.user) return next(new AppError('Could not create entry. User not found!', 404));
      auxiliaryFields.userId = req.user?._id;
    }

    const modelName = Model.modelName.toLowerCase();
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { ...(req.body as mongoose.UpdateQuery<TModel>), ...auxiliaryFields },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(new AppError(`No ${modelName} found with the Id {${req.params.id}}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

const deleteOne = <TModel>(Model: mongoose.Model<TModel>) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${modelName} found with the Id {${req.params.id}}`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const executeTransaction = async <TModel>(model: mongoose.Model<TModel>, handler: (session: ClientSession) => Promise<void>) => {
  const session = await model.startSession();
  session.startTransaction();
  try {
    await handler(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return { success: false, error: (error as Error).message };
  }
  return { success: true };
};

export default { getAll, getOne, createOne, updateOne, deleteOne, executeTransaction };
