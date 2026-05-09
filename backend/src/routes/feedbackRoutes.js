import { Router } from 'express';
import { createFeedback, getUserFeedbacks, getFeedbackById } from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createFeedback);
router.get('/', getUserFeedbacks);
router.get('/:id', getFeedbackById);

export default router;
