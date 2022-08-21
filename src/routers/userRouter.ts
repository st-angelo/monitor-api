import { Router } from 'express';
import { protect, updatePassword } from '../controllers/authentication';

const router = Router();

// Protect all routes that come after this middleware use
router.use(protect);

router.patch('/updatePassword', updatePassword);

export default router;
