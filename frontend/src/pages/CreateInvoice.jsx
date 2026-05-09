import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import InvoiceForm from '../components/invoice/InvoiceForm.jsx';
import Loader from '../components/common/Loader.jsx';
import { useInvoice } from '../hooks/useInvoices.js';

export default function CreateInvoice() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const { data, isLoading } = useInvoice(id);
  const existing = data?.invoice;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {id ? 'Modifier la facture' : 'Nouvelle facture'}
          </h1>
          {id && isLoading ? <Loader /> : <InvoiceForm existing={existing} />}
        </main>
      </div>
    </div>
  );
}
