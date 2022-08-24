import { Router } from 'express';
import {
  forgotPassword,
  resetPassword,
  signin,
  signup,
} from '../controllers/authentication';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

export default router;
