import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import Loader from '../components/common/Loader.jsx';
import { useInvoice, useUpdateStatut, useDeleteInvoice } from '../hooks/useInvoices.js';
import { invoiceService } from '../services/invoiceService.js';
import { formatEuro, formatDate, statutColor, statutLabel } from '../utils/formatters.js';

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [relanceLoading, setRelanceLoading] = useState(false);
  const [relanceMsg, setRelanceMsg] = useState('');

  const { data, isLoading } = useInvoice(id);
  const statutMutation = useUpdateStatut();
  const deleteMutation = useDeleteInvoice();
  const invoice = data?.invoice;

  const handleRelance = async () => {
    setRelanceLoading(true);
    setRelanceMsg('');
    try {
      await invoiceService.sendRelance(id);
      setRelanceMsg('Relance envoyée avec succès.');
    } catch (err) {
      setRelanceMsg(err.response?.data?.error || 'Erreur lors de l\'envoi.');
    } finally {
      setRelanceLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cette facture définitivement ?')) return;
    await deleteMutation.mutateAsync(id);
    navigate('/invoices');
  };

  const handlePDF = () => {
    const url = `${import.meta.env.VITE_API_URL || '/api'}/invoices/${id}/pdf`;
    const token = localStorage.getItem('token');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${invoice.numero_facture}.pdf`;
        a.click();
      });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/invoices" className="hover:text-blue-600">Factures</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{invoice?.numero_facture || '...'}</span>
          </div>

          {isLoading ? <Loader /> : !invoice ? (
            <div className="text-red-500">Facture introuvable.</div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-mono">{invoice.numero_facture}</h1>
                    <p className="text-gray-500 mt-1">{invoice.client_name}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={invoice.statut}
                      onChange={e => statutMutation.mutate({ id, statut: e.target.value })}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold border-0 cursor-pointer ${statutColor(invoice.statut)}`}
                    >
                      {['brouillon', 'émise', 'payée', 'impayée'].map(s => (
                        <option key={s} value={s}>{statutLabel(s)}</option>
                      ))}
                    </select>
                    <Link to={`/invoices/${id}/edit`}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Modifier
                    </Link>
                    <button onClick={handlePDF}
                      className="px-3 py-1.5 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50">
                      Télécharger PDF
                    </button>
                    <button onClick={handleDelete}
                      className="px-3 py-1.5 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-4 border-t border-gray-100 text-sm overflow-hidden">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Date</p>
                    <p className="font-medium">{formatDate(invoice.date_facture)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Échéance</p>
                    <p className="font-medium">{formatDate(invoice.date_delai_paiement)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email client</p>
                    <p className="font-medium truncate">{invoice.client_email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Adresse</p>
                    <p className="font-medium text-xs">{invoice.client_adresse || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Lines */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Description', 'Qté', 'Prix HT', 'Total'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(invoice.lines || []).map((line, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">{line.description}</td>
                          <td className="px-4 py-3 text-gray-500">{line.quantite}</td>
                          <td className="px-4 py-3 text-gray-500">{formatEuro(line.prix_unitaire)}</td>
                          <td className="px-4 py-3 font-semibold">{formatEuro(line.montant)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-4 border-t border-gray-100 space-y-1.5 text-sm max-w-xs ml-auto">
                  <div className="flex justify-between text-gray-600">
                    <span>Total HT</span><span>{formatEuro(invoice.montant_ht)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (20%)</span><span>{formatEuro(invoice.montant_tva)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-1.5">
                    <span>Total TTC</span><span>{formatEuro(invoice.montant_ttc)}</span>
                  </div>
                </div>
              </div>

              {/* Relance */}
              {invoice.client_email && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Relance par email</h3>
                  {relanceMsg && (
                    <div className={`mb-3 px-4 py-2 rounded-lg text-sm ${relanceMsg.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {relanceMsg}
                    </div>
                  )}
                  <button onClick={handleRelance} disabled={relanceLoading}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                    {relanceLoading ? 'Envoi...' : '📧 Envoyer une relance'}
                  </button>
                </div>
              )}

              {invoice.notes && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
