import { Router } from 'express';
import { protect, updatePassword } from '../controllers/authentication';
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/user';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.patch('/updatePassword', updatePassword);

// Categories
router.route('/category').get(getCategories).post(addCategory);

router.route('/category/:id').get(getCategory).patch(updateCategory).delete(deleteCategory);

export default router;
