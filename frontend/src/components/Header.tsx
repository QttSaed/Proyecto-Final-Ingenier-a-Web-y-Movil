import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { searchOutline, personOutline, cartOutline, menuOutline, closeOutline, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'singles' | 'otros'>('main');

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setActiveSubMenu('main'); // reset on close
  };
  
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => setActiveSubMenu('main'), 300); // reset after animation
  };

  return (
    <>
      <header className="main-header">
        <div className="hamburger-container" onClick={toggleMenu}>
          <IonIcon icon={menuOutline} />
        </div>

        <div className="logo-container">
          <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo-placeholder">TCGStore</div>
          </Link>
        </div>
        
        <nav className="nav-links desktop-only">
          {/* Menú desplegable para Singles */}
          <div className="nav-dropdown">
            <span className="dropdown-trigger">Singles ⌄</span>
            <div className="dropdown-menu">
              <Link to="/catalog/pokemon-singles">Pokémon</Link>
              <Link to="/catalog/onepiece-singles">One Piece</Link>
              <Link to="/catalog/riftbound-singles">Riftbound</Link>
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
              <Link to="/catalog/lotesdcarta">Lotes de Cartas</Link>
            </div>
          </div>

          <Link to="/catalog/accesorios"><span>Accesorios</span></Link>
          <Link to="/catalog/ofertas"><span>Ofertas</span></Link>
          <Link to="/catalog/preventa"><span>Preventas</span></Link>
          <Link to="/catalog/eventos"><span>Eventos</span></Link>
        </nav>

        <div className="header-icons">
          <Link to="/search" style={{ color: 'inherit' }}><IonIcon icon={searchOutline} /></Link>
          <Link to="/login" style={{ color: 'inherit' }}><IonIcon icon={personOutline} /></Link>
          <Link to="/cart" style={{ color: 'inherit' }}><IonIcon icon={cartOutline} /></Link>
        </div>
      </header>

      {/* Mobile Side Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
        <div className="mobile-side-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <Link to="/home" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="logo-placeholder">TCGStore</span>
            </Link>
            <IonIcon icon={closeOutline} onClick={closeMenu} className="close-menu-icon" />
          </div>
          
          <div className="mobile-menu-slider-container">
            {/* MAIN MENU */}
            <div className={`mobile-menu-pane ${activeSubMenu === 'main' ? 'active' : 'hidden-left'}`}>
              <div className="mobile-menu-links">
                <div className="mobile-nav-item" onClick={() => setActiveSubMenu('singles')}>
                  Singles <IonIcon icon={chevronForwardOutline} />
                </div>
                <Link to="/catalog/pokemon" onClick={closeMenu}>Pokemon</Link>
                <Link to="/catalog/magic" onClick={closeMenu}>Magic</Link>
                <Link to="/catalog/onepiece" onClick={closeMenu}>One Piece</Link>
                <Link to="/catalog/riftbound" onClick={closeMenu}>Riftbound</Link>
                
                <div className="mobile-nav-item" onClick={() => setActiveSubMenu('otros')}>
                  Otros <IonIcon icon={chevronForwardOutline} />
                </div>
                
                <Link to="/catalog/accesorios" onClick={closeMenu}>Accesorios</Link>
                <Link to="/catalog/ofertas" onClick={closeMenu}>Ofertas</Link>
                <Link to="/catalog/preventa" onClick={closeMenu}>Preventas</Link>
                <Link to="/catalog/eventos" onClick={closeMenu}>Eventos</Link>
              </div>
            </div>

            {/* SINGLES SUBMENU */}
            <div className={`mobile-menu-pane ${activeSubMenu === 'singles' ? 'active' : 'hidden-right'}`}>
              <div className="mobile-submenu-header" onClick={() => setActiveSubMenu('main')}>
                <IonIcon icon={chevronBackOutline} /> Volver
              </div>
              <div className="mobile-menu-links">
                <div className="mobile-nav-title">Singles</div>
                <Link to="/catalog/pokemon-singles" onClick={closeMenu}>Pokémon</Link>
                <Link to="/catalog/onepiece-singles" onClick={closeMenu}>One Piece</Link>
                <Link to="/catalog/riftbound-singles" onClick={closeMenu}>Riftbound</Link>
              </div>
            </div>

            {/* OTROS SUBMENU */}
            <div className={`mobile-menu-pane ${activeSubMenu === 'otros' ? 'active' : 'hidden-right'}`}>
              <div className="mobile-submenu-header" onClick={() => setActiveSubMenu('main')}>
                <IonIcon icon={chevronBackOutline} /> Volver
              </div>
              <div className="mobile-menu-links">
                <div className="mobile-nav-title">Otros</div>
                <Link to="/catalog/digimon" onClick={closeMenu}>Digimon</Link>
                <Link to="/catalog/gundam" onClick={closeMenu}>Gundam</Link>
                <Link to="/catalog/lotesdcarta" onClick={closeMenu}>Lotes de Cartas</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
