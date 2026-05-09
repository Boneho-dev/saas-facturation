import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold text-blue-600 text-lg">FacturePro</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-600 font-medium">
          {user?.nom_entreprise}
        </span>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
