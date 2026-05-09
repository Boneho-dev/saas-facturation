import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import DevisTable from '../components/devis/DevisTable.jsx';
import Loader from '../components/common/Loader.jsx';
import { devisService } from '../services/devisService.js';

export default function ViewDevis() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const params = { page, limit: 20, ...(filter ? { statut: filter } : {}) };
  const { data, isLoading } = useQuery({
    queryKey: ['devis', params],
    queryFn: () => devisService.getAll(params),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => devisService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devis'] }),
  });

  const statutMutation = useMutation({
    mutationFn: ({ id, statut }) => devisService.updateStatut(id, statut),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devis'] }),
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
            <Link to="/devis/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
              + Nouveau devis
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['', 'brouillon', 'envoyé', 'accepté', 'rejeté'].map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {s === '' ? 'Tous' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? <Loader /> : (
            <DevisTable
              devis={data?.devis || []}
              onDelete={(id) => {
                if (window.confirm('Supprimer ce devis ?')) deleteMutation.mutate(id);
              }}
              onStatutChange={(id, statut) => statutMutation.mutate({ id, statut })}
            />
          )}
        </main>
      </div>
    </div>
  );
}
