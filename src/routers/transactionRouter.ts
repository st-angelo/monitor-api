import { Router } from 'express';
import { protect } from '../controllers/authentication';
import {
  addTransaction,
  deleteTransaction,
  getTransactionsForSummary,
  getTransaction,
  getTransactions,
  updateTransaction,
  deleteTransactions,
  getLatestTransactionData,
} from '../controllers/transaction';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.route('/').get(getTransactions).post(addTransaction).delete(deleteTransactions);

router.route('/summary').get(getTransactionsForSummary);

router.route('/latest').get(getLatestTransactionData);

router.route('/:id').get(getTransaction).patch(updateTransaction).delete(deleteTransaction);

export default router;
