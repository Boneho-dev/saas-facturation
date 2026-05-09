import { Link, Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-blue-600 font-bold text-2xl">FacturePro</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Créer votre compte</h1>
          <p className="text-gray-500 text-sm mt-1">Gratuit, sans engagement</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
