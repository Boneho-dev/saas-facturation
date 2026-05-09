import { Invoice } from '../models/index.js';
import { Devis } from '../models/index.js';
import { Op } from 'sequelize';

export async function generateInvoiceNumber(userId) {
  const year = new Date().getFullYear();
  const prefix = `FAC-${year}-`;

  const last = await Invoice.findOne({
    where: {
      user_id: userId,
      numero_facture: { [Op.like]: `${prefix}%` },
    },
    order: [['id', 'DESC']],
  });

  const nextNum = last
    ? parseInt(last.numero_facture.split('-').pop()) + 1
    : 1;

  return `${prefix}${String(nextNum).padStart(3, '0')}`;
}

export async function generateDevisNumber(userId) {
  const year = new Date().getFullYear();
  const prefix = `DEV-${year}-`;

  const last = await Devis.findOne({
    where: {
      user_id: userId,
      numero_devis: { [Op.like]: `${prefix}%` },
    },
    order: [['id', 'DESC']],
  });

  const nextNum = last
    ? parseInt(last.numero_devis.split('-').pop()) + 1
    : 1;

  return `${prefix}${String(nextNum).padStart(3, '0')}`;
}
