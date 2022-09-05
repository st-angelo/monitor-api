import mongoose from 'mongoose';
import Category from '../entities/category.js';

const categorySchema = new mongoose.Schema<Category>({
  name: {
    type: String,
    required: [true, 'Category name needs to be specified'],
    maxlength: [50, 'Category name cannot have more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Category description needs to be specified'],
    maxlength: [500, 'Category description cannot have more than 500 characters'],
  },
  color: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const CategoryModel = mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
