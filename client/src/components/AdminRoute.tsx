import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.Service';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const isAuth = isAuthenticated();
  
  // Leemos el usuario del localStorage para ver su rol
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Si no está logueado, al login
  if (!isAuth || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado pero no es admin ni moderador, lo expulsamos
  if (user.role !== 'ADMIN' && user.role !== 'MODERADOR') {
    // Lo expulsamos a su perfil (o al home)
    return <Navigate to="/perfil" replace />;
  }

  // Si tiene permiso, pase adelante
  return <>{children}</>;
};

export default AdminRoute;