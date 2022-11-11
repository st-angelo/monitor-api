import { Router } from 'express';
import { protect } from '../controllers/authentication';
import { getImplicitValues } from '../controllers/miscellaneous';

const router = Router();

router.use(protect);

router.get('/implicit-values', getImplicitValues);

export default router;
