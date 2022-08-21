import { Router } from 'express';
import { protect } from '../controllers/authentication';
import { spendings } from '../controllers/spending';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.get('/', spendings);

export default router;
