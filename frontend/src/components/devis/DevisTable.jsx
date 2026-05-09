import { Link } from 'react-router-dom';
import { formatEuro, formatDate, statutColor, statutLabel } from '../../utils/formatters.js';

export default function DevisTable({ devis = [], onDelete, onStatutChange }) {
  const handlePDF = (id, numero) => {
    const url = `${import.meta.env.VITE_API_URL || '/api'}/devis/${id}/pdf`;
    const token = localStorage.getItem('token');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${numero}.pdf`;
        a.click();
      });
  };

  if (devis.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400 text-sm">
        Aucun devis trouvé.
        <div className="mt-3">
          <Link to="/devis/new" className="text-blue-600 font-medium hover:underline">
            Créer un devis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Numéro', 'Client', 'Créé le', 'Valide jusqu\'au', 'Montant TTC', 'Statut', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {devis.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-blue-600 font-semibold whitespace-nowrap">
                  {d.numero_devis}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{d.client_name}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(d.date_creation)}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(d.date_validite)}</td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatEuro(d.montant_ttc)}</td>
                <td className="px-4 py-3">
                  <select
                    value={d.statut}
                    onChange={e => onStatutChange(d.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${statutColor(d.statut)}`}
                  >
                    {['brouillon', 'envoyé', 'accepté', 'rejeté'].map(s => (
                      <option key={s} value={s}>{statutLabel(s)}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Link to={`/devis/${d.id}/edit`}
                      className="text-xs text-blue-600 hover:underline font-medium">
                      Modifier
                    </Link>
                    <button onClick={() => handlePDF(d.id, d.numero_devis)}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                      PDF
                    </button>
                    <button onClick={() => onDelete(d.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium">
                      Suppr.
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
