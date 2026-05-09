import { Invoice, InvoiceLine, Devis, DevisLine, User } from '../models/index.js';
import { generateInvoicePDF, generateDevisPDF } from '../services/pdfService.js';

export async function downloadInvoicePDF(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
      include: [{ model: InvoiceLine, as: 'lines' }],
    });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });

    const user = await User.findByPk(req.userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.numero_facture}.pdf"`
    );

    const doc = generateInvoicePDF(invoice.toJSON(), user.toJSON());
    doc.pipe(res);
    doc.end();
  } catch (err) {
    next(err);
  }
}

export async function downloadDevisPDF(req, res, next) {
  try {
    const devis = await Devis.findOne({
      where: { id: req.params.id, user_id: req.userId },
      include: [{ model: DevisLine, as: 'lines' }],
    });
    if (!devis) return res.status(404).json({ error: 'Devis introuvable.' });

    const user = await User.findByPk(req.userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${devis.numero_devis}.pdf"`
    );

    const doc = generateDevisPDF(devis.toJSON(), user.toJSON());
    doc.pipe(res);
    doc.end();
  } catch (err) {
    next(err);
  }
}
