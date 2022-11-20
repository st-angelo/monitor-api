import { Router } from 'express';
import { forgotPassword, resetPassword, signin, signOut, signup } from '../controllers/authentication';

const router = Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', signOut);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

export default router;
