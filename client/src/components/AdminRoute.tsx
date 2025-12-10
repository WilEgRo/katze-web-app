import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.Service';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const isAuth = isAuthenticated();
  
  // 1. Leemos el usuario del localStorage para ver su rol
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Si no está logueado, al login
  if (!isAuth || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. SI ESTÁ LOGUEADO PERO NO ES ADMIN NI MODERADOR
  if (user.role !== 'ADMIN' && user.role !== 'MODERADOR') {
    // Lo expulsamos a su perfil (o al home)
    return <Navigate to="/perfil" replace />;
  }

  // 4. Si tiene permiso, pase adelante
  return <>{children}</>;
};

export default AdminRoute;