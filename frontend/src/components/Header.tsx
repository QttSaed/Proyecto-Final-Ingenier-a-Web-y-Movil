import React from 'react';
import { IonIcon } from '@ionic/react';
import { searchOutline, personOutline, cartOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-placeholder">TCGStore</div>
        </Link>
      </div>
      
      <nav className="nav-links">
        {/* Menú desplegable para Singles */}
        <div className="nav-dropdown">
          <span className="dropdown-trigger">Singles ⌄</span>
          <div className="dropdown-menu">
            <Link to="/catalog/pokemon-singles">Pokémon</Link>
            <Link to="/catalog/magic-singles">Magic</Link>
            <Link to="/catalog/onepiece-singles">One Piece</Link>
            <Link to="/catalog/riftbound-singles">Riftbound</Link>
            <Link to="/catalog/digimon-singles">Digimon</Link>
            <Link to="/catalog/gundam-singles">Gundam</Link>
          </div>
        </div>

        {/* Resto de enlaces normales */}
        <Link to="/catalog/pokemon"><span>Pokemon</span></Link>
        <Link to="/catalog/magic"><span>Magic</span></Link>
        <Link to="/catalog/onepiece"><span>One Piece</span></Link>
        <Link to="/catalog/riftbound"><span>Riftbound</span></Link>

        {/* Menú desplegable para Otros */}
        <div className="nav-dropdown">
          <span className="dropdown-trigger">Otros ⌄</span>
          <div className="dropdown-menu">
            <Link to="/catalog/digimon">Digimon</Link>
            <Link to="/catalog/gundam">Gundam</Link>
            <Link to="/catalog/lotes">Lotes de Cartas</Link>
          </div>
        </div>

        <Link to="/catalog/accesorios"><span>Accesorios</span></Link>
        <Link to="/catalog/ofertas"><span>Ofertas</span></Link>
        <Link to="/catalog/preventas"><span>Preventas</span></Link>
        <Link to="/catalog/eventos"><span>Eventos</span></Link>
      </nav>

      <div className="header-icons">
        <Link to="/search" style={{ color: 'inherit' }}><IonIcon icon={searchOutline} /></Link>
        <Link to="/login" style={{ color: 'inherit' }}><IonIcon icon={personOutline} /></Link>
        <Link to="/cart" style={{ color: 'inherit' }}><IonIcon icon={cartOutline} /></Link>
      </div>
    </header>
  );
};

export default Header;
