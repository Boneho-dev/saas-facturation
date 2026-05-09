export function formatEuro(amount) {
  const n = parseFloat(amount) || 0;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export function statutColor(statut) {
  const map = {
    brouillon: 'bg-gray-100 text-gray-600',
    émise: 'bg-blue-100 text-blue-700',
    envoyé: 'bg-blue-100 text-blue-700',
    payée: 'bg-green-100 text-green-700',
    accepté: 'bg-green-100 text-green-700',
    impayée: 'bg-red-100 text-red-700',
    rejeté: 'bg-red-100 text-red-700',
  };
  return map[statut] || 'bg-gray-100 text-gray-600';
}

export function statutLabel(statut) {
  const map = {
    brouillon: 'Brouillon',
    émise: 'Émise',
    envoyé: 'Envoyé',
    payée: 'Payée',
    accepté: 'Accepté',
    impayée: 'Impayée',
    rejeté: 'Rejeté',
  };
  return map[statut] || statut;
}
