import React from 'react';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { logoFacebook, logoInstagram, logoTiktok, logoWhatsapp } from 'ionicons/icons';

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="social-icons">
        <Link to="/coming-soon" aria-label="Facebook"><IonIcon icon={logoFacebook} /></Link>
        <Link to="/coming-soon" aria-label="Instagram"><IonIcon icon={logoInstagram} /></Link>
        <Link to="/coming-soon" aria-label="TikTok"><IonIcon icon={logoTiktok} /></Link>
        <Link to="/coming-soon" aria-label="WhatsApp"><IonIcon icon={logoWhatsapp} /></Link>
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
