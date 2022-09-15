import { Router } from 'express';
import { protect } from '../controllers/authentication';
import { addTransaction, deleteTransaction, getTransaction, getTransactions, updateTransaction } from '../controllers/transaction';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.route('/').get(getTransactions).post(addTransaction);

router.route('/:id').get(getTransaction).patch(updateTransaction).delete(deleteTransaction);

export default router;
