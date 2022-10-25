import { Router } from 'express';
import { protect } from '../controllers/authentication';
import { getCategories, getCurrencies, getTransactionTypes } from '../controllers/dictionary';

const router = Router();

router.use(protect);

// Categories
router.route('/transactionType').get(getTransactionTypes);

router.route('/category').get(getCategories);

router.route('/currency').get(getCurrencies);

export default router;
