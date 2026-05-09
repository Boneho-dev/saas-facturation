import { Link } from 'react-router-dom';

const features = [
  { icon: '🧾', title: 'Factures professionnelles', desc: 'Créez et envoyez des factures aux normes françaises en quelques secondes.' },
  { icon: '📋', title: 'Devis en un clic', desc: 'Générez des devis détaillés et transformez-les en factures facilement.' },
  { icon: '✨', title: 'IA intégrée', desc: 'Laissez Claude générer automatiquement les lignes de vos prestations.' },
  { icon: '📄', title: 'Export PDF', desc: 'Téléchargez vos factures en PDF avec toutes les mentions légales obligatoires.' },
  { icon: '📧', title: 'Relances automatiques', desc: 'Envoyez des relances email aux clients en retard de paiement.' },
  { icon: '📊', title: 'Tableau de bord', desc: 'Suivez vos revenus, factures impayées et statistiques en temps réel.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <span className="text-blue-600 font-bold text-xl">FacturePro</span>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/login" className="hidden sm:inline text-sm text-gray-600 font-medium hover:text-gray-900">Se connecter</Link>
            <Link to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-12 sm:pb-16 text-center">
        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          Pour auto-entrepreneurs français
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          La facturation simple
          <span className="text-blue-600"> et intelligente</span>
        </h1>
        <p className="text-base sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Créez des factures et devis professionnels aux normes françaises. Avec l'IA de Claude pour générer vos prestations en un instant.
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <Link to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-colors text-base sm:text-lg shadow-lg shadow-blue-200">
            Commencer gratuitement
          </Link>
          <Link to="/login"
            className="border border-gray-300 text-gray-700 font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-base sm:text-lg">
            Se connecter
          </Link>
        </div>
      </section>


      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 sm:mb-12">
          Tout ce qu'il vous faut
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12 sm:py-16 text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Prêt à vous lancer ?</h2>
        <p className="text-blue-100 mb-8 text-base sm:text-lg">Gratuit, sans engagement, sans carte bancaire.</p>
        <Link to="/register"
          className="bg-white text-blue-600 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base sm:text-lg inline-block">
          Créer mon compte
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>FacturePro — Développé par <strong className="text-gray-600">Agre Agency</strong> </p>
      </footer>
    </div>
  );
}
