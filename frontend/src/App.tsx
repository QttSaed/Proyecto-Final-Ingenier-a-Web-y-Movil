import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRouter from './routes/AppRouter';

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
import ScrollToTop from './components/ScrollToTop';

setupIonicReact();

const App: React.FC = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'tcgstore-google-client-id'}>
    <IonApp>
      <CartProvider>
        <IonReactRouter>
          <ScrollToTop />
          <AppRouter />
        </IonReactRouter>
        <SettingsBubble />
      </CartProvider>
    </IonApp>
  </GoogleOAuthProvider>
);

export default App;
