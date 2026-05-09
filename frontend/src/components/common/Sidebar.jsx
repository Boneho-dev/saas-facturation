import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { to: '/invoices', label: 'Factures', icon: '🧾' },
  { to: '/devis', label: 'Devis', icon: '📋' },
  { to: '/settings', label: 'Paramètres', icon: '⚙️' },
  { to: '/feedback', label: 'Feedback', icon: '💬' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        z-30 transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-blue-600 font-bold text-xl">FacturePro</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-4">
          <NavLink
            to="/invoices/new" onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            + Nouvelle facture
          </NavLink>
        </div>
      </aside>
    </>
  );
}
