import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import { feedbackService } from '../services/feedbackService.js';

const TYPES = [
  { value: 'bug', label: '🐛 Signaler un bug', desc: 'Un comportement inattendu ou une erreur' },
  { value: 'feature_request', label: '✨ Demander une fonctionnalité', desc: 'Une nouvelle fonctionnalité souhaitée' },
  { value: 'improvement', label: '⚡ Suggérer une amélioration', desc: 'Améliorer ce qui existe déjà' },
  { value: 'other', label: '💬 Autre', desc: 'Tout autre retour' },
];

const TYPE_COLORS = {
  bug: 'border-red-200 bg-red-50 text-red-700',
  feature_request: 'border-purple-200 bg-purple-50 text-purple-700',
  improvement: 'border-blue-200 bg-blue-50 text-blue-700',
  other: 'border-gray-200 bg-gray-50 text-gray-700',
};

const STATUS_LABELS = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
  reviewed: { label: 'Examiné', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: 'En cours', color: 'bg-orange-100 text-orange-700' },
  resolved: { label: 'Résolu', color: 'bg-green-100 text-green-700' },
};

const TYPE_LABELS = {
  bug: '🐛 Bug',
  feature_request: '✨ Fonctionnalité',
  improvement: '⚡ Amélioration',
  other: '💬 Autre',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function Feedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState('form');

  const [form, setForm] = useState({ type: '', title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const loadHistory = async () => {
    if (historyLoaded) return;
    setHistoryLoading(true);
    try {
      const data = await feedbackService.getAll();
      setHistory(data.feedbacks || []);
      setHistoryLoaded(true);
    } catch {
      // silently ignore
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === 'history') loadHistory();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.type) return setError('Veuillez sélectionner un type de feedback.');
    if (form.title.trim().length < 5) return setError('Le titre doit contenir au moins 5 caractères.');
    if (form.message.trim().length < 10) return setError('Le message doit contenir au moins 10 caractères.');

    setSubmitting(true);
    try {
      const data = await feedbackService.create(form);
      setSuccess(true);
      setForm({ type: '', title: '', message: '' });
      setHistory(prev => [data.feedback, ...prev]);
      setHistoryLoaded(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi du feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Feedback</h1>
            <p className="text-gray-500 text-sm mt-0.5">Aidez-nous à améliorer FacturePro</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => handleTabChange('form')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Envoyer un feedback
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mes feedbacks
            </button>
          </div>

          {/* Form tab */}
          {tab === 'form' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre retour !</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Votre feedback a bien été transmis à l'équipe. Nous en tiendrons compte pour améliorer FacturePro.
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Envoyer un autre feedback
                    </button>
                    <button
                      onClick={() => handleTabChange('history')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voir mes feedbacks
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Type selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de feedback <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TYPES.map(({ value, label, desc }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, type: value }))}
                          className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            form.type === value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Résumez votre feedback en une phrase..."
                      maxLength={255}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/255</p>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Décrivez en détail votre retour : étapes pour reproduire le bug, contexte d'utilisation, bénéfice attendu..."
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{form.message.length} caractères (min. 10)</p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      {submitting ? 'Envoi...' : 'Envoyer le feedback'}
                    </button>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </Link>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* History tab */}
          {tab === 'history' && (
            <div className="space-y-4">
              {historyLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400 text-sm">
                  Aucun feedback envoyé pour l'instant.
                  <div className="mt-3">
                    <button
                      onClick={() => handleTabChange('form')}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Envoyer mon premier feedback
                    </button>
                  </div>
                </div>
              ) : (
                history.map(fb => {
                  const status = STATUS_LABELS[fb.status] || STATUS_LABELS.new;
                  return (
                    <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_COLORS[fb.type] || TYPE_COLORS.other}`}>
                            {TYPE_LABELS[fb.type] || fb.type}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(fb.created_at)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{fb.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-wrap">{fb.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
