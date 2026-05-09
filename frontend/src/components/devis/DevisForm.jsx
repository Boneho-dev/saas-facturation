import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { devisService } from '../../services/devisService.js';
import InvoiceLineRow from '../invoice/InvoiceLineRow.jsx';
import AIGenerator from '../invoice/AIGenerator.jsx';

const emptyLine = () => ({ description: '', quantite: 1, prix_unitaire: 0, montant: 0 });

const today = () => new Date().toISOString().split('T')[0];
const plusDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

export default function DevisForm({ existing }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showAI, setShowAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    client_name: '', client_email: '', client_adresse: '',
    date_creation: today(), date_validite: plusDays(30),
    notes: '', statut: 'brouillon',
    lines: [emptyLine()],
  });

  useEffect(() => {
    if (existing) {
      setForm({
        client_name: existing.client_name || '',
        client_email: existing.client_email || '',
        client_adresse: existing.client_adresse || '',
        date_creation: existing.date_creation || today(),
        date_validite: existing.date_validite || plusDays(30),
        notes: existing.notes || '',
        statut: existing.statut || 'brouillon',
        lines: existing.lines?.length ? existing.lines.map(l => ({
          description: l.description, quantite: l.quantite,
          prix_unitaire: l.prix_unitaire, montant: l.montant,
        })) : [emptyLine()],
      });
    }
  }, [existing]);

  const setField = (name, val) => setForm(f => ({ ...f, [name]: val }));
  const updateLine = (i, line) => setForm(f => ({ ...f, lines: f.lines.map((l, idx) => idx === i ? line : l) }));
  const addLine = () => setForm(f => ({ ...f, lines: [...f.lines, emptyLine()] }));
  const removeLine = (i) => setForm(f => ({ ...f, lines: f.lines.filter((_, idx) => idx !== i) }));
  const acceptAILines = (aiLines) => setForm(f => ({ ...f, lines: [...f.lines.filter(l => l.description), ...aiLines] }));

  const montantHT = form.lines.reduce((s, l) => s + parseFloat(l.montant || 0), 0);
  const montantTVA = montantHT * 0.2;
  const montantTTC = montantHT + montantTVA;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (existing) {
        await devisService.update(existing.id, form);
      } else {
        await devisService.create(form);
      }
      qc.invalidateQueries({ queryKey: ['devis'] });
      navigate('/devis');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {showAI && <AIGenerator onAccept={acceptAILines} onClose={() => setShowAI(false)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informations client</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom client *</label>
              <input type="text" value={form.client_name} onChange={e => setField('client_name', e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email client</label>
              <input type="email" value={form.client_email} onChange={e => setField('client_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse client</label>
              <textarea value={form.client_adresse} onChange={e => setField('client_adresse', e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Dates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date création *</label>
              <input type="date" value={form.date_creation} onChange={e => setField('date_creation', e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date validité *</label>
              <input type="date" value={form.date_validite} onChange={e => setField('date_validite', e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select value={form.statut} onChange={e => setField('statut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['brouillon', 'envoyé', 'accepté', 'rejeté'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Prestations</h3>
            <button type="button" onClick={() => setShowAI(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              ✨ Générer avec IA
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {form.lines.map((line, i) => (
              <InvoiceLineRow key={i} line={line} index={i} onChange={updateLine} onRemove={removeLine} canRemove={form.lines.length > 1} />
            ))}
          </div>
          <button type="button" onClick={addLine} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            + Ajouter une ligne
          </button>
          <div className="mt-5 border-t border-gray-100 pt-4 space-y-1.5 max-w-xs ml-auto text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Total HT</span><span className="font-semibold">{montantHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>TVA (20%)</span><span className="font-semibold">{montantTVA.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-1.5">
              <span>Total TTC</span><span>{montantTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
          <textarea value={form.notes} onChange={e => setField('notes', e.target.value)} rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Conditions particulières, validité du devis..." />
        </div>

        <div className="flex items-center gap-3 pb-4">
          <button type="button" onClick={() => navigate('/devis')}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Annuler
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm">
            {saving ? 'Enregistrement...' : existing ? 'Mettre à jour' : 'Sauvegarder le devis'}
          </button>
        </div>
      </form>
    </>
  );
}
