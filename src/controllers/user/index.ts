import Category from '../../data/entities/category';
import CategoryModel from '../../data/models/categoryModel';
import SpendingModel from '../../data/models/spendingModel';
import { AppError } from '../../utils/appError';
import { catchAsync } from '../../utils/catchAsync';
import factory from '../factory';
import { AddCategoryBody, UpdateCategoryBody } from './metadata';

export const getCategories = factory.getAll(CategoryModel);

export const getCategory = factory.getOne(CategoryModel);

export const addCategory = factory.createOne<Category, AddCategoryBody>(CategoryModel);

export const updateCategory = factory.updateOne<Category, UpdateCategoryBody>(CategoryModel);

export const deleteCategory = catchAsync(async (req, res, next) => {
  const { success, error } = await factory.executeTransaction(CategoryModel, async session => {
    await SpendingModel.deleteMany({ categoryId: req.params.id }).session(session);

    const deleted = await CategoryModel.findByIdAndDelete(req.params.id).session(session);

    if (!deleted) throw new AppError(`No category found with the Id {${req.params.id}}`, 404);
  });

  if (!success) return next(new AppError(error || `Could not delete category with Id ${req.params.id}`, 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
