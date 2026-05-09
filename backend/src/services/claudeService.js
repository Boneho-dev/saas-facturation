import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateInvoiceLines(description) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Tu es un assistant qui aide à générer des lignes de facture pour auto-entrepreneurs français.

À partir de cette description : "${description}"

Génère un tableau JSON de lignes de facture avec ce format EXACT (rien d'autre, pas de markdown, pas d'explication) :
[
  { "description": "...", "quantite": 1, "prix_unitaire": 0, "montant": 0 }
]

Calcule montant = quantite × prix_unitaire. Sois précis et professionnel.`,
    }],
  });

  const text = message.content[0].text.trim();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
