import { Router } from 'express';
import { protect } from '../controllers/authentication';
import { addSpending, deleteSpending, getSpending, getSpendings, updateSpending } from '../controllers/spending';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.route('/').get(getSpendings).post(addSpending);

router.route('/:id').get(getSpending).patch(updateSpending).delete(deleteSpending);

export default router;
