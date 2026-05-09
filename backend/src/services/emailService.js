import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendRelanceEmail(invoice, user) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('Configuration SMTP manquante. Veuillez configurer les variables SMTP_HOST, SMTP_USER et SMTP_PASSWORD.');
  }

  const transporter = createTransporter();
  const montant = parseFloat(invoice.montant_ttc).toFixed(2).replace('.', ',');

  await transporter.sendMail({
    from: `"${user.nom_entreprise}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: invoice.client_email,
    subject: `Relance - Facture ${invoice.numero_facture} - ${montant} €`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1D4ED8;">Rappel de paiement</h2>
        <p>Bonjour ${invoice.client_name},</p>
        <p>
          Sauf erreur de notre part, la facture <strong>${invoice.numero_facture}</strong>
          d'un montant de <strong>${montant} €</strong> reste impayée.
        </p>
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr style="background: #EFF6FF;">
            <td style="padding: 10px; border: 1px solid #DBEAFE;"><strong>Numéro</strong></td>
            <td style="padding: 10px; border: 1px solid #DBEAFE;">${invoice.numero_facture}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #DBEAFE;"><strong>Montant TTC</strong></td>
            <td style="padding: 10px; border: 1px solid #DBEAFE;">${montant} €</td>
          </tr>
          <tr style="background: #EFF6FF;">
            <td style="padding: 10px; border: 1px solid #DBEAFE;"><strong>Échéance</strong></td>
            <td style="padding: 10px; border: 1px solid #DBEAFE;">
              ${new Date(invoice.date_delai_paiement).toLocaleDateString('fr-FR')}
            </td>
          </tr>
        </table>
        <p>Merci de bien vouloir procéder au règlement dans les meilleurs délais.</p>
        <p>Cordialement,<br/><strong>${user.nom_entreprise}</strong></p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
        <p style="font-size: 11px; color: #9CA3AF;">
          ${user.nom_entreprise} — SIRET : ${user.siret} — ${user.adresse}
        </p>
      </div>
    `,
  });
}
