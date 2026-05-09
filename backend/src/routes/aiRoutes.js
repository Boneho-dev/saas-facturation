import { Router } from 'express';
import { generateLines } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.post('/generate-lines', generateLines);

export default router;
