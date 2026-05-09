import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import devisRoutes from './routes/devisRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/feedbacks', feedbackRoutes);

app.use(errorHandler);

export default app;
