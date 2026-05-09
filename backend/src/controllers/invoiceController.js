import { Op } from 'sequelize';
import { Invoice, InvoiceLine, User } from '../models/index.js';
import { generateInvoiceNumber } from '../utils/generateNumero.js';
import { sendRelanceEmail } from '../services/emailService.js';

export async function getInvoices(req, res, next) {
  try {
    const { statut, page = 1, limit = 20 } = req.query;
    const where = { user_id: req.userId };
    if (statut) where.statut = statut;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [{ model: InvoiceLine, as: 'lines' }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ total: count, page: parseInt(page), invoices: rows });
  } catch (err) {
    next(err);
  }
}

export async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
      include: [{ model: InvoiceLine, as: 'lines' }],
    });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
}

export async function createInvoice(req, res, next) {
  try {
    const {
      client_name, client_email, client_adresse,
      date_facture, date_delai_paiement, notes, statut,
      lines = [],
    } = req.body;

    if (!client_name || !date_facture || !date_delai_paiement) {
      return res.status(400).json({ error: 'Client, date facture et délai de paiement sont requis.' });
    }
    if (!lines.length) {
      return res.status(400).json({ error: 'Au moins une ligne est requise.' });
    }

    const numero_facture = await generateInvoiceNumber(req.userId);

    const montant_ht = lines.reduce((sum, l) => sum + parseFloat(l.montant || 0), 0);
    const montant_tva = parseFloat((montant_ht * 0.2).toFixed(2));
    const montant_ttc = parseFloat((montant_ht + montant_tva).toFixed(2));

    const invoice = await Invoice.create({
      user_id: req.userId,
      numero_facture,
      client_name, client_email, client_adresse,
      montant_ht, montant_tva, montant_ttc,
      statut: statut || 'brouillon',
      date_facture, date_delai_paiement, notes,
    });

    const invoiceLines = await InvoiceLine.bulkCreate(
      lines.map(l => ({
        invoice_id: invoice.id,
        description: l.description,
        quantite: l.quantite,
        prix_unitaire: l.prix_unitaire,
        montant: l.montant,
      }))
    );

    res.status(201).json({ invoice: { ...invoice.toJSON(), lines: invoiceLines } });
  } catch (err) {
    next(err);
  }
}

export async function updateInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });

    const {
      client_name, client_email, client_adresse,
      date_facture, date_delai_paiement, notes, statut,
      lines,
    } = req.body;

    if (lines) {
      const montant_ht = lines.reduce((sum, l) => sum + parseFloat(l.montant || 0), 0);
      const montant_tva = parseFloat((montant_ht * 0.2).toFixed(2));
      const montant_ttc = parseFloat((montant_ht + montant_tva).toFixed(2));

      await invoice.update({
        client_name, client_email, client_adresse,
        montant_ht, montant_tva, montant_ttc,
        statut, date_facture, date_delai_paiement, notes,
      });

      await InvoiceLine.destroy({ where: { invoice_id: invoice.id } });
      await InvoiceLine.bulkCreate(
        lines.map(l => ({
          invoice_id: invoice.id,
          description: l.description,
          quantite: l.quantite,
          prix_unitaire: l.prix_unitaire,
          montant: l.montant,
        }))
      );
    } else {
      await invoice.update({ client_name, client_email, client_adresse, statut, date_facture, date_delai_paiement, notes });
    }

    const updated = await Invoice.findOne({
      where: { id: invoice.id },
      include: [{ model: InvoiceLine, as: 'lines' }],
    });

    res.json({ invoice: updated });
  } catch (err) {
    next(err);
  }
}

export async function updateStatut(req, res, next) {
  try {
    const { statut } = req.body;
    const validStatuts = ['brouillon', 'émise', 'payée', 'impayée'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }

    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });

    await invoice.update({ statut });
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
}

export async function deleteInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });

    await invoice.destroy();
    res.json({ message: 'Facture supprimée.' });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const invoices = await Invoice.findAll({ where: { user_id: req.userId } });

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total_facture: 0,
      total_payee: 0,
      total_impayee: 0,
      total_ce_mois: 0,
      count_brouillon: 0,
      count_emise: 0,
      count_payee: 0,
      count_impayee: 0,
    };

    for (const inv of invoices) {
      const ttc = parseFloat(inv.montant_ttc);
      stats.total_facture += ttc;
      if (inv.statut === 'payée') { stats.total_payee += ttc; stats.count_payee++; }
      if (inv.statut !== 'payée') { stats.total_impayee += ttc; stats.count_impayee++; }
      if (inv.statut === 'brouillon') stats.count_brouillon++;
      if (inv.statut === 'émise') stats.count_emise++;
      if (new Date(inv.created_at) >= firstOfMonth) stats.total_ce_mois += ttc;
    }

    res.json({ stats });
  } catch (err) {
    next(err);
  }
}

export async function sendRelance(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
      include: [{ model: InvoiceLine, as: 'lines' }],
    });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });
    if (!invoice.client_email) {
      return res.status(400).json({ error: 'Email client manquant pour envoyer la relance.' });
    }

    const user = await User.findByPk(req.userId);
    await sendRelanceEmail(invoice, user);

    res.json({ message: 'Relance envoyée avec succès.' });
  } catch (err) {
    next(err);
  }
}
