import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateInvoice from './pages/CreateInvoice.jsx';
import ViewInvoices from './pages/ViewInvoices.jsx';
import InvoiceDetails from './pages/InvoiceDetails.jsx';
import CreateDevis from './pages/CreateDevis.jsx';
import ViewDevis from './pages/ViewDevis.jsx';
import Settings from './pages/Settings.jsx';
import Feedback from './pages/Feedback.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<ViewInvoices />} />
            <Route path="/invoices/new" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/invoices/:id/edit" element={<CreateInvoice />} />
            <Route path="/devis" element={<ViewDevis />} />
            <Route path="/devis/new" element={<CreateDevis />} />
            <Route path="/devis/:id/edit" element={<CreateDevis />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
