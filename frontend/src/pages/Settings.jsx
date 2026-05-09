import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ nom_entreprise: '', adresse: '', telephone: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        nom_entreprise: user.nom_entreprise || '',
        adresse: user.adresse || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const { user: updated } = await authService.updateProfile(form);
      updateUser(updated);
      setMsg('Profil mis à jour avec succès.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Informations de l'entreprise</h2>

            {msg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg}
              </div>
            )}

            {/* Read-only info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">SIRET</p>
                <p className="text-sm font-medium text-gray-700 font-mono">{user?.siret}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise *</label>
                <input type="text" value={form.nom_entreprise}
                  onChange={e => setForm(f => ({ ...f, nom_entreprise: e.target.value }))} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <textarea value={form.adresse}
                  onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} required rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" value={form.telephone}
                  onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm">
                {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
