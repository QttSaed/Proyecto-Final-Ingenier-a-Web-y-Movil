import React from 'react';
import { IonIcon } from '@ionic/react';
import { searchOutline, personOutline, cartOutline } from 'ionicons/icons';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <div className="logo-placeholder">TCGStore</div>
      </div>
      
      <nav className="nav-links">
        <span>Singles ⌄</span>
        <span>Pokemon</span>
        <span>Magic</span>
        <span>One Piece</span>
        <span>Riftbound</span>
        <span>Otros ⌄</span>
        <span>Accesorios</span>
        <span>Ofertas</span>
        <span>Preventas</span>
        <span>Eventos</span>
      </nav>

      <div className="header-icons">
        <IonIcon icon={searchOutline} />
        <IonIcon icon={personOutline} />
        <IonIcon icon={cartOutline} />
      </div>
    </header>
  );
};

export default Header;
