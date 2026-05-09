import { generateInvoiceLines } from '../services/claudeService.js';

export async function generateLines(req, res, next) {
  try {
    const { description } = req.body;
    if (!description || description.trim().length < 5) {
      return res.status(400).json({ error: 'Description trop courte pour générer des lignes.' });
    }

    const lines = await generateInvoiceLines(description.trim());
    res.json({ lines });
  } catch (err) {
    if (err.message?.includes('parse')) {
      return res.status(502).json({ error: 'Réponse IA invalide, veuillez réessayer.' });
    }
    next(err);
  }
}
