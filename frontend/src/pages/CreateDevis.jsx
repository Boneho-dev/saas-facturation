import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import DevisForm from '../components/devis/DevisForm.jsx';
import Loader from '../components/common/Loader.jsx';
import { useQuery } from '@tanstack/react-query';
import { devisService } from '../services/devisService.js';

export default function CreateDevis() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['devis', id],
    queryFn: () => devisService.getById(id),
    enabled: !!id,
  });
  const existing = data?.devis;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {id ? 'Modifier le devis' : 'Nouveau devis'}
          </h1>
          {id && isLoading ? <Loader /> : <DevisForm existing={existing} />}
        </main>
      </div>
    </div>
  );
}
