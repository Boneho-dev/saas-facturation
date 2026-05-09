import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { downloadInvoicePDF, downloadDevisPDF } from '../controllers/pdfController.js';

const router = Router();

router.use(authenticate);
router.get('/invoices/:id', downloadInvoicePDF);
router.get('/devis/:id', downloadDevisPDF);

export default router;
