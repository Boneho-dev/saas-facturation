import { Link, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-blue-600 font-bold text-2xl">FacturePro</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Bon retour !</h1>
          <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
