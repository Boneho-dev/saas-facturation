import { Router } from 'express';
import {
  getInvoices, getInvoice, createInvoice, updateInvoice,
  updateStatut, deleteInvoice, getStats, sendRelance,
} from '../controllers/invoiceController.js';
import { downloadInvoicePDF } from '../controllers/pdfController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.patch('/:id/statut', updateStatut);
router.delete('/:id', deleteInvoice);
router.get('/:id/pdf', downloadInvoicePDF);
router.post('/:id/relance', sendRelance);

export default router;
