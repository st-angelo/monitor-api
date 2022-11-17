import { Router } from 'express';
import multer from 'multer';
import { protect } from '../controllers/authentication';
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateAccountData,
  updateCategory,
  updatePassword,
} from '../controllers/user';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.patch('/updatePassword', updatePassword);

router.patch('/updateAccountData', multer().single('avatar'), updateAccountData);

// Categories
router.route('/category').get(getCategories).post(addCategory);

router.route('/category/:id').get(getCategory).patch(updateCategory).delete(deleteCategory);

export default router;
