import { Link } from 'react-router-dom';
import { formatEuro, formatDate, statutColor, statutLabel } from '../../utils/formatters.js';

export default function RecentInvoices({ invoices = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Dernières factures</h2>
        <Link to="/invoices" className="text-sm text-blue-600 hover:underline font-medium">
          Voir tout
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Aucune facture pour l'instant.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Numéro', 'Client', 'Date', 'Montant TTC', 'Statut'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.slice(0, 8).map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-blue-600 font-medium">
                    <Link to={`/invoices/${inv.id}`}>{inv.numero_facture}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{inv.client_name}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(inv.date_facture)}</td>
                  <td className="px-4 py-3 font-semibold">{formatEuro(inv.montant_ttc)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statutColor(inv.statut)}`}>
                      {statutLabel(inv.statut)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
