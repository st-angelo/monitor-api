import { Router } from 'express';
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from '../controllers/authentication';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

export default router;
