import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'admin' | 'client' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  // Simulamos la verificación leyendo el localStorage
  const currentRole = localStorage.getItem('role');

  if (!currentRole) {
    // Si no está logueado, lo mandamos al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRole !== 'any' && currentRole !== allowedRole) {
    // Si tiene un rol distinto al permitido, lo devolvemos al home
    return <Navigate to="/home" replace />;
  }

  // Si pasa las validaciones, renderiza la pantalla solicitada
  return <>{children}</>;
};

export default ProtectedRoute;
