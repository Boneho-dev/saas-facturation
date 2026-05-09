import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useInvoiceStats, useInvoices } from '../hooks/useInvoices.js';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import RecentInvoices from '../components/dashboard/RecentInvoices.jsx';
import Loader from '../components/common/Loader.jsx';
import { formatEuro } from '../utils/formatters.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: statsData, isLoading: statsLoading } = useInvoiceStats();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices({ limit: 8 });

  const stats = statsData?.stats;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-500 text-sm mt-0.5">Bonjour, {user?.nom_entreprise} 👋</p>
            </div>
            <Link to="/invoices/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap">
              + Nouvelle facture
            </Link>
          </div>

          {statsLoading ? <Loader /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Total facturé" value={formatEuro(stats?.total_facture || 0)} icon="💰" color="blue" />
              <StatCard label="Factures payées" value={formatEuro(stats?.total_payee || 0)} icon="✅" color="green"
                sub={`${stats?.count_payee || 0} facture(s)`} />
              <StatCard label="Impayées" value={formatEuro(stats?.total_impayee || 0)} icon="⚠️" color="red"
                sub={`${stats?.count_impayee || 0} facture(s)`} />
              <StatCard label="Ce mois" value={formatEuro(stats?.total_ce_mois || 0)} icon="📅" color="purple" />
            </div>
          )}

          {invoicesLoading ? <Loader /> : (
            <RecentInvoices invoices={invoicesData?.invoices || []} />
          )}
        </main>
      </div>
    </div>
  );
}
