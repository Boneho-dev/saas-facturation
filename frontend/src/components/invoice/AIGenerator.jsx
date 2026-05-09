import { useState } from 'react';
import { useAI } from '../../hooks/useAI.js';

export default function AIGenerator({ onAccept, onClose }) {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const { generate, loading, error } = useAI();

  const handleGenerate = async () => {
    const lines = await generate(description);
    if (lines) setSuggestions(lines);
  };

  const handleLineChange = (i, field, val) => {
    const updated = suggestions.map((l, idx) => {
      if (idx !== i) return l;
      const line = { ...l, [field]: val };
      if (field === 'quantite' || field === 'prix_unitaire') {
        const q = parseFloat(field === 'quantite' ? val : line.quantite) || 0;
        const p = parseFloat(field === 'prix_unitaire' ? val : line.prix_unitaire) || 0;
        line.montant = parseFloat((q * p).toFixed(2));
      }
      return line;
    });
    setSuggestions(updated);
  };

  const handleRemove = (i) => setSuggestions(suggestions.filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Générer avec l'IA</h3>
            <p className="text-sm text-gray-500 mt-0.5">Claude suggère des lignes à partir de votre description</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez votre prestation
            </label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              rows={3} placeholder="Ex : Création d'un site web vitrine avec 5 pages, intégration CMS, déploiement..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!suggestions && (
            <button
              onClick={handleGenerate} disabled={loading || description.length < 5}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>✨ Générer les lignes</>
              )}
            </button>
          )}

          {suggestions && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Suggestions — modifiez avant d'accepter</h4>
              <div className="text-xs text-gray-500 grid grid-cols-12 gap-2 px-1">
                <span className="col-span-5">Description</span>
                <span className="col-span-2">Qté</span>
                <span className="col-span-2">P.U. (€)</span>
                <span className="col-span-2">Total</span>
              </div>
              {suggestions.map((line, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-blue-50 rounded-lg p-2">
                  <input
                    className="col-span-5 px-2 py-1.5 border border-blue-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.description} onChange={e => handleLineChange(i, 'description', e.target.value)}
                  />
                  <input
                    type="number" className="col-span-2 px-2 py-1.5 border border-blue-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.quantite} onChange={e => handleLineChange(i, 'quantite', e.target.value)} min="1"
                  />
                  <input
                    type="number" className="col-span-2 px-2 py-1.5 border border-blue-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.prix_unitaire} onChange={e => handleLineChange(i, 'prix_unitaire', e.target.value)} min="0" step="0.01"
                  />
                  <div className="col-span-2 text-sm font-semibold text-right pr-1">
                    {parseFloat(line.montant || 0).toFixed(2)} €
                  </div>
                  <button onClick={() => handleRemove(i)} className="col-span-1 text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSuggestions(null)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Regénérer
                </button>
                <button
                  onClick={() => { onAccept(suggestions); onClose(); }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  Accepter et ajouter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
