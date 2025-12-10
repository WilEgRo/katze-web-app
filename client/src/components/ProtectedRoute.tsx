import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.Service';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const isAuth = isAuthenticated();
  
  console.log("🔒 Verificando seguridad. Autenticado:", isAuth);

  if (!isAuth) {
    // Si no está logueado, LO SACAMOS inmediatamente al login
    return <Navigate to="/login" replace />;
  }

  // Si sí está logueado, le dejamos pasar
  return <>{children}</>;
};

export default ProtectedRoute;