import CategoryDto from '../../data/dto/categoryDto';
import prisma from '../../data/prisma';
import { AppError } from '../../utils/appError';
import { catchAsync } from '../../utils/catchAsync';
import { TypedRequest as Request } from '../common';
import { AddCategoryBody, UpdateCategoryBody } from './metadata';

export const getCategories = catchAsync(async (req: Request, res, next) => {
  const categories = await prisma.category.findMany({ where: { userId: req.user.id } });

  res.status(200).json({
    success: true,
    data: categories.map(category => new CategoryDto(category)),
  });
});

export const getCategory = catchAsync(async (req, res, next) => {
  const category = await prisma.category.findFirst({ where: { id: req.params.id } });

  if (!category) return next(new AppError(`Could not find category with id ${req.params.id}`, 404));

  res.status(200).json({
    success: true,
    data: new CategoryDto(category),
  });
});

export const addCategory = catchAsync(async (req: Request<AddCategoryBody>, res, next) => {
  const { name, description, color } = req.body;

  const category = await prisma.category.create({
    data: {
      name,
      description,
      color,
      userId: req.user.id,
    },
  });

  res.status(200).json({
    success: true,
    data: new CategoryDto(category),
  });
});

export const updateCategory = catchAsync(async (req: Request<UpdateCategoryBody>, res, next) => {
  const { name, description, color } = req.body;

  const category = await prisma.category.update({
    data: {
      name,
      description,
      color,
    },
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    success: true,
    data: new CategoryDto(category),
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  await prisma.$transaction([
    prisma.spending.deleteMany({ where: { categoryId: req.params.id } }),
    prisma.category.delete({ where: { id: req.params.id } }),
  ]);

  res.status(204);
});
