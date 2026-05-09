import { Devis, DevisLine } from '../models/index.js';
import { generateDevisNumber } from '../utils/generateNumero.js';

export async function getDevis(req, res, next) {
  try {
    const { statut, page = 1, limit = 20 } = req.query;
    const where = { user_id: req.userId };
    if (statut) where.statut = statut;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Devis.findAndCountAll({
      where,
      include: [{ model: DevisLine, as: 'lines' }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ total: count, page: parseInt(page), devis: rows });
  } catch (err) {
    next(err);
  }
}

export async function getDevisById(req, res, next) {
  try {
    const devis = await Devis.findOne({
      where: { id: req.params.id, user_id: req.userId },
      include: [{ model: DevisLine, as: 'lines' }],
    });
    if (!devis) return res.status(404).json({ error: 'Devis introuvable.' });
    res.json({ devis });
  } catch (err) {
    next(err);
  }
}

export async function createDevis(req, res, next) {
  try {
    const {
      client_name, client_email, client_adresse,
      date_creation, date_validite, notes, statut,
      lines = [],
    } = req.body;

    if (!client_name || !date_creation || !date_validite) {
      return res.status(400).json({ error: 'Client, date création et date validité sont requis.' });
    }
    if (!lines.length) {
      return res.status(400).json({ error: 'Au moins une ligne est requise.' });
    }

    const numero_devis = await generateDevisNumber(req.userId);

    const montant_ht = lines.reduce((sum, l) => sum + parseFloat(l.montant || 0), 0);
    const montant_tva = parseFloat((montant_ht * 0.2).toFixed(2));
    const montant_ttc = parseFloat((montant_ht + montant_tva).toFixed(2));

    const devis = await Devis.create({
      user_id: req.userId,
      numero_devis,
      client_name, client_email, client_adresse,
      montant_ht, montant_tva, montant_ttc,
      statut: statut || 'brouillon',
      date_creation, date_validite, notes,
    });

    const devisLines = await DevisLine.bulkCreate(
      lines.map(l => ({
        devis_id: devis.id,
        description: l.description,
        quantite: l.quantite,
        prix_unitaire: l.prix_unitaire,
        montant: l.montant,
      }))
    );

    res.status(201).json({ devis: { ...devis.toJSON(), lines: devisLines } });
  } catch (err) {
    next(err);
  }
}

export async function updateDevis(req, res, next) {
  try {
    const devis = await Devis.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!devis) return res.status(404).json({ error: 'Devis introuvable.' });

    const {
      client_name, client_email, client_adresse,
      date_creation, date_validite, notes, statut,
      lines,
    } = req.body;

    if (lines) {
      const montant_ht = lines.reduce((sum, l) => sum + parseFloat(l.montant || 0), 0);
      const montant_tva = parseFloat((montant_ht * 0.2).toFixed(2));
      const montant_ttc = parseFloat((montant_ht + montant_tva).toFixed(2));

      await devis.update({
        client_name, client_email, client_adresse,
        montant_ht, montant_tva, montant_ttc,
        statut, date_creation, date_validite, notes,
      });

      await DevisLine.destroy({ where: { devis_id: devis.id } });
      await DevisLine.bulkCreate(
        lines.map(l => ({
          devis_id: devis.id,
          description: l.description,
          quantite: l.quantite,
          prix_unitaire: l.prix_unitaire,
          montant: l.montant,
        }))
      );
    } else {
      await devis.update({ client_name, client_email, client_adresse, statut, date_creation, date_validite, notes });
    }

    const updated = await Devis.findOne({
      where: { id: devis.id },
      include: [{ model: DevisLine, as: 'lines' }],
    });

    res.json({ devis: updated });
  } catch (err) {
    next(err);
  }
}

export async function updateStatutDevis(req, res, next) {
  try {
    const { statut } = req.body;
    const validStatuts = ['brouillon', 'envoyé', 'accepté', 'rejeté'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }

    const devis = await Devis.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!devis) return res.status(404).json({ error: 'Devis introuvable.' });

    await devis.update({ statut });
    res.json({ devis });
  } catch (err) {
    next(err);
  }
}

export async function deleteDevis(req, res, next) {
  try {
    const devis = await Devis.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!devis) return res.status(404).json({ error: 'Devis introuvable.' });

    await devis.destroy();
    res.json({ message: 'Devis supprimé.' });
  } catch (err) {
    next(err);
  }
}
