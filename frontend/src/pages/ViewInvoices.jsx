import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import InvoiceTable from '../components/invoice/InvoiceTable.jsx';
import Loader from '../components/common/Loader.jsx';
import { useInvoices, useDeleteInvoice, useUpdateStatut } from '../hooks/useInvoices.js';

export default function ViewInvoices() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const params = { page, limit: 20, ...(filter ? { statut: filter } : {}) };
  const { data, isLoading, isError } = useInvoices(params);
  const deleteMutation = useDeleteInvoice();
  const statutMutation = useUpdateStatut();

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette facture ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatutChange = (id, statut) => {
    statutMutation.mutate({ id, statut });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
            <Link to="/invoices/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
              + Nouvelle facture
            </Link>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {['', 'brouillon', 'émise', 'payée', 'impayée'].map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {s === '' ? 'Toutes' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? <Loader /> : isError ? (
            <div className="text-red-500 text-sm">Erreur lors du chargement.</div>
          ) : (
            <InvoiceTable
              invoices={data?.invoices || []}
              onDelete={handleDelete}
              onStatutChange={handleStatutChange}
            />
          )}

          {/* Pagination */}
          {data && data.total > 20 && (
            <div className="flex justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Précédent
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= data.total}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Suivant
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
