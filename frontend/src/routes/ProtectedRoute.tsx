import { ReactNode } from 'react';
import { IonPage } from '@ionic/react';
import { Navigate, useLocation, useResolvedPath } from 'react-router-dom';
import { Role, useAuth } from '../services/authService';

export default function ProtectedRoute({ allowedRoles, allowGuest = false, children }: { allowedRoles: Role[]; allowGuest?: boolean; children: ReactNode }) {
  const user = useAuth();
  const location = useLocation();
  const route = useResolvedPath('.');
  const isAuthorized = user ? allowedRoles.includes(user.role) : allowGuest;
  const isActive = route.pathname.replace(/\/+$/, '') === location.pathname.replace(/\/+$/, '');

  return (
    <IonPage>
      {isAuthorized ? (
        children
      ) : isActive ? (
        !user ? (
          <Navigate to="/login" state={{ from: location.pathname }} replace />
        ) : (
          <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />
        )
      ) : null}
    </IonPage>
  );
}

