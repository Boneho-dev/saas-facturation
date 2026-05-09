export default function InvoiceLineRow({ line, index, onChange, onRemove, canRemove }) {
  const handleChange = (field, value) => {
    const updated = { ...line, [field]: value };
    if (field === 'quantite' || field === 'prix_unitaire') {
      const q = parseFloat(field === 'quantite' ? value : updated.quantite) || 0;
      const p = parseFloat(field === 'prix_unitaire' ? value : updated.prix_unitaire) || 0;
      updated.montant = parseFloat((q * p).toFixed(2));
    }
    onChange(index, updated);
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2">
      <div className="col-span-12 sm:col-span-5">
        <input
          type="text" value={line.description} onChange={e => handleChange('description', e.target.value)}
          placeholder="Description de la prestation" required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="col-span-4 sm:col-span-2">
        <input
          type="number" value={line.quantite} onChange={e => handleChange('quantite', e.target.value)}
          placeholder="Qté" min="1" required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="col-span-4 sm:col-span-2">
        <input
          type="number" value={line.prix_unitaire} onChange={e => handleChange('prix_unitaire', e.target.value)}
          placeholder="Prix HT" min="0" step="0.01" required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium text-right">
          {parseFloat(line.montant || 0).toFixed(2)} €
        </div>
      </div>
      <div className="col-span-1">
        <button
          type="button" onClick={() => onRemove(index)} disabled={!canRemove}
          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
          title="Supprimer la ligne"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
