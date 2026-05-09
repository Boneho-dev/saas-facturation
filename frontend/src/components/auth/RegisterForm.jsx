import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', nom_entreprise: '',
    siret: '', adresse: '', telephone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vous@exemple.fr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min. 8 caractères" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise *</label>
        <input type="text" name="nom_entreprise" value={form.nom_entreprise} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Agre Agency" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SIRET * (14 chiffres)</label>
        <input type="text" name="siret" value={form.siret} onChange={handleChange} required pattern="\d{14}"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="12345678901234" maxLength={14} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
        <textarea name="adresse" value={form.adresse} onChange={handleChange} required rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="1 Rue des Artisans, 49000 Angers" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="06 00 00 00 00" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors">
        {loading ? 'Création...' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">Se connecter</Link>
      </p>
    </form>
  );
}
