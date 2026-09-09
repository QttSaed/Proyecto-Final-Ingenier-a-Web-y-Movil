import React from 'react';
import { IonIcon } from '@ionic/react';
import { logoFacebook, logoInstagram, logoTiktok, logoWhatsapp } from 'ionicons/icons';

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="social-icons">
        <IonIcon icon={logoFacebook} />
        <IonIcon icon={logoInstagram} />
        <IonIcon icon={logoTiktok} />
        <IonIcon icon={logoWhatsapp} />
        <span>Whatsapp</span>
      </div>
      <div className="shipping-info">
        Envíos a todo Chile | Despachamos en 24hrs hábiles | Retiros en Maipú y Providencia
      </div>
      <div className="top-spacer"></div>
    </div>
  );
};

export default TopBar;
