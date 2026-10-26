import { lazy, Suspense } from 'react';
import { Navigate, Route, useParams, useLocation } from 'react-router-dom';
import { IonRouterOutlet, IonContent } from '@ionic/react';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ProductDetail from '../pages/ProductDetail';
import Checkout from '../pages/Checkout';
import ComingSoon from '../pages/ComingSoon';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import ShippingReturns from '../pages/ShippingReturns';
import Contact from '../pages/Contact';

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

function ProductAlias() {
  const { id } = useParams();
  return <Navigate to={`/product/${id}`} replace />;
}

function VerifyEmailAlias() {
  const { search } = useLocation();
  return <Navigate to={`/verificar-correo${search}`} replace />;
}

function ResetPasswordAlias() {
  const { search } = useLocation();
  return <Navigate to={`/restablecer-contrasena${search}`} replace />;
}

export default function AppRouter() {
  const admin = (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<IonContent className="admin-content ion-padding">Cargando administración…</IonContent>}>
        <AdminDashboard />
      </Suspense>
    </ProtectedRoute>
  );

  return (
    <IonRouterOutlet>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/catalog/:category" element={<Catalog />} />
      <Route path="/catalogo" element={<Navigate to="/catalog/todos" replace />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/producto/:id" element={<ProductAlias />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verificar-correo" element={<VerifyEmail />} />
      <Route path="/verify-email" element={<VerifyEmailAlias />} />
      <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
      <Route path="/forgot-password" element={<Navigate to="/recuperar-contrasena" replace />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPasswordAlias />} />
      <Route path="/registro" element={<Navigate to="/register" replace />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/proximamente" element={<Navigate to="/coming-soon" replace />} />
      <Route path="/search" element={<ComingSoon />} />
      <Route path="/perfil" element={<ProtectedRoute allowedRoles={['client', 'admin']}><Profile /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute allowedRoles={['client']} allowGuest><Cart /></ProtectedRoute>} />
      <Route path="/carrito" element={<Navigate to="/cart" replace />} />
      <Route path="/checkout" element={<ProtectedRoute allowedRoles={['client']}><Checkout /></ProtectedRoute>} />
      <Route path="/admin" element={admin} />
      <Route path="/admin/inventario" element={admin} />
      <Route path="/admin/ordenes" element={admin} />
      <Route path="/terminos" element={<Terms />} />
      <Route path="/terminos-servicio" element={<Terms />} />
      <Route path="/privacidad" element={<Privacy />} />
      <Route path="/politica-privacidad" element={<Privacy />} />
      <Route path="/envios-devoluciones" element={<ShippingReturns />} />
      <Route path="/envios" element={<ShippingReturns />} />
      <Route path="/politica-envio" element={<ShippingReturns />} />
      <Route path="/politica-reembolso" element={<ShippingReturns />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </IonRouterOutlet>
  );
}
