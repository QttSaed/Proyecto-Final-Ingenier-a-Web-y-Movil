import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';

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
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
      <SettingsBubble />
    </CartProvider>
  </IonApp>
);

export default App;
