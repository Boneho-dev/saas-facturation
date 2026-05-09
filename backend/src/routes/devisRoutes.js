import { Router } from 'express';
import {
  getDevis, getDevisById, createDevis, updateDevis,
  updateStatutDevis, deleteDevis,
} from '../controllers/devisController.js';
import { downloadDevisPDF } from '../controllers/pdfController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getDevis);
router.get('/:id', getDevisById);
router.post('/', createDevis);
router.put('/:id', updateDevis);
router.patch('/:id/statut', updateStatutDevis);
router.delete('/:id', deleteDevis);
router.get('/:id/pdf', downloadDevisPDF);

export default router;
