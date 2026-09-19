import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ComingSoon from './pages/ComingSoon';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { CartProvider } from './context/CartContext';

import SettingsBubble from './components/SettingsBubble';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <CartProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" element={<Home />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/catalogo" element={<Navigate to="/catalog/pokemon" replace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/search" element={<ComingSoon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Rutas Protegidas del Administrador */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/inventario" element={<AdminDashboard />} />
          <Route path="/admin/ordenes" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
      <SettingsBubble />
    </CartProvider>
  </IonApp>
);

export default App;
