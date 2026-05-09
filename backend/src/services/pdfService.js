import PDFDocument from 'pdfkit';

function formatEuro(amount) {
  return `${parseFloat(amount).toFixed(2).replace('.', ',')} €`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR');
}

function buildDocument(doc, data, user, type) {
  const isInvoice = type === 'facture';
  const numero = isInvoice ? data.numero_facture : data.numero_devis;
  const title = isInvoice ? 'FACTURE' : 'DEVIS';
  const lines = data.lines || [];

  const BLUE = '#1D4ED8';
  const DARK = '#111827';
  const GRAY = '#6B7280';
  const LIGHT = '#F9FAFB';
  const pageWidth = 595;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  // Header background
  doc.rect(0, 0, pageWidth, 130).fill('#EFF6FF');

  // Company name
  doc.fontSize(22).fillColor(BLUE).font('Helvetica-Bold')
    .text(user.nom_entreprise, margin, 40, { width: 260 });

  doc.fontSize(9).fillColor(GRAY).font('Helvetica')
    .text(user.adresse, margin, 68)
    .text(`SIRET : ${user.siret}`, margin, 80)
    .text(user.telephone || '', margin, 92);

  // Title + numero
  doc.fontSize(26).fillColor(BLUE).font('Helvetica-Bold')
    .text(title, pageWidth - margin - 200, 40, { width: 200, align: 'right' });

  doc.fontSize(10).fillColor(DARK).font('Helvetica')
    .text(`N° ${numero}`, pageWidth - margin - 200, 72, { width: 200, align: 'right' });

  const dateLabel = isInvoice ? 'Date de facture' : 'Date de création';
  const dateVal = isInvoice ? data.date_facture : data.date_creation;
  const date2Label = isInvoice ? 'Échéance' : 'Valide jusqu\'au';
  const date2Val = isInvoice ? data.date_delai_paiement : data.date_validite;

  doc.fontSize(9).fillColor(GRAY)
    .text(`${dateLabel} : ${formatDate(dateVal)}`, pageWidth - margin - 200, 86, { width: 200, align: 'right' })
    .text(`${date2Label} : ${formatDate(date2Val)}`, pageWidth - margin - 200, 98, { width: 200, align: 'right' });

  // Divider
  doc.moveTo(margin, 140).lineTo(pageWidth - margin, 140).strokeColor('#DBEAFE').lineWidth(1).stroke();

  // Client section
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('FACTURÉ À :', margin, 155);
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold')
    .text(data.client_name, margin, 170);
  doc.fontSize(9).fillColor(GRAY).font('Helvetica');
  if (data.client_email) doc.text(data.client_email, margin, 185);
  if (data.client_adresse) doc.text(data.client_adresse, margin, 197);

  // Lines table
  let y = 240;
  const colX = [margin, margin + 240, margin + 300, margin + 380, margin + 440];
  const colW = [240, 60, 80, 60, contentWidth - 440];

  // Table header
  doc.rect(margin, y, contentWidth, 22).fill(BLUE);
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
  const headers = ['Description', 'Qté', 'Prix unitaire', 'Total'];
  [0, 1, 2, 3].forEach((i) => {
    doc.text(headers[i], colX[i] + 4, y + 6, { width: colW[i], align: i === 0 ? 'left' : 'right' });
  });

  y += 22;
  doc.font('Helvetica').fontSize(9);

  lines.forEach((line, idx) => {
    const rowY = y + idx * 22;
    if (idx % 2 === 0) doc.rect(margin, rowY, contentWidth, 22).fill(LIGHT);
    doc.fillColor(DARK)
      .text(line.description, colX[0] + 4, rowY + 6, { width: colW[0] - 8 })
      .text(String(line.quantite), colX[1] + 4, rowY + 6, { width: colW[1] - 4, align: 'right' })
      .text(formatEuro(line.prix_unitaire), colX[2] + 4, rowY + 6, { width: colW[2] - 4, align: 'right' })
      .text(formatEuro(line.montant), colX[3] + 4, rowY + 6, { width: colW[3] - 4, align: 'right' });
  });

  y += lines.length * 22 + 10;

  // Totals
  doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor('#E5E7EB').lineWidth(1).stroke();
  y += 10;

  const totalsX = pageWidth - margin - 200;
  const totalsLabelW = 120;
  const totalsValW = 80;

  doc.fillColor(GRAY).fontSize(9).font('Helvetica')
    .text('Total HT :', totalsX, y, { width: totalsLabelW })
    .text(formatEuro(data.montant_ht), totalsX + totalsLabelW, y, { width: totalsValW, align: 'right' });

  doc.text('TVA (20 %) :', totalsX, y + 16, { width: totalsLabelW })
    .text(formatEuro(data.montant_tva), totalsX + totalsLabelW, y + 16, { width: totalsValW, align: 'right' });

  // TTC box
  doc.rect(totalsX - 5, y + 32, 205, 24).fill(BLUE);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11)
    .text('TOTAL TTC :', totalsX, y + 38, { width: totalsLabelW })
    .text(formatEuro(data.montant_ttc), totalsX + totalsLabelW, y + 38, { width: totalsValW, align: 'right' });

  y += 80;

  // Notes
  if (data.notes) {
    doc.fillColor(GRAY).font('Helvetica').fontSize(9)
      .text('Notes :', margin, y)
      .text(data.notes, margin, y + 12, { width: contentWidth });
    y += 40;
  }

  // Legal footer
  const footerY = doc.page.height - 60;
  doc.moveTo(margin, footerY - 10).lineTo(pageWidth - margin, footerY - 10)
    .strokeColor('#E5E7EB').lineWidth(0.5).stroke();

  doc.fillColor(GRAY).fontSize(7.5).font('Helvetica')
    .text(
      'TVA non applicable, art. 293 B du CGI  —  ' +
      `${user.nom_entreprise}  —  SIRET : ${user.siret}`,
      margin, footerY, { width: contentWidth, align: 'center' }
    );

  if (isInvoice) {
    doc.text(
      'En cas de retard de paiement, des pénalités de retard au taux légal en vigueur seront appliquées.',
      margin, footerY + 10, { width: contentWidth, align: 'center' }
    );
  }
}

export function generateInvoicePDF(invoice, user) {
  const doc = new PDFDocument({ margin: 0, size: 'A4' });
  buildDocument(doc, invoice, user, 'facture');
  return doc;
}

export function generateDevisPDF(devis, user) {
  const doc = new PDFDocument({ margin: 0, size: 'A4' });
  buildDocument(doc, devis, user, 'devis');
  return doc;
}
