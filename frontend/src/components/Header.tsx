import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IonIcon } from '@ionic/react';
import { searchOutline, personOutline, cartOutline, menuOutline, closeOutline, chevronForwardOutline, chevronBackOutline, gridOutline } from 'ionicons/icons';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'singles' | 'otros'>('main');
  const navigate = useNavigate();

  const handlePersonClick = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/perfil');
    } else {
      navigate('/login');
    }
  };

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
          <NavLink to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo-placeholder">TCGStore</div>
          </NavLink>
        </div>
        
        <nav className="nav-links desktop-only">
          <div className="nav-dropdown">
            <span className={`dropdown-trigger ${['/catalog/pokemon-singles', '/catalog/onepiece-singles', '/catalog/riftbound-singles'].includes(location.pathname) ? 'active-link' : ''}`}>Singles ⌄</span>
            <div className="dropdown-menu">
              <NavLink to="/catalog/pokemon-singles" className={({isActive}) => isActive ? "active-link" : ""}>Pokémon</NavLink>
              <NavLink to="/catalog/onepiece-singles" className={({isActive}) => isActive ? "active-link" : ""}>One Piece</NavLink>
              <NavLink to="/catalog/riftbound-singles" className={({isActive}) => isActive ? "active-link" : ""}>Riftbound</NavLink>
            </div>
          </div>

          <NavLink to="/catalog/pokemon" className={({isActive}) => isActive ? "active-link" : ""}><span>Pokemon</span></NavLink>
          <NavLink to="/catalog/magic" className={({isActive}) => isActive ? "active-link" : ""}><span>Magic</span></NavLink>
          <NavLink to="/catalog/onepiece" className={({isActive}) => isActive ? "active-link" : ""}><span>One Piece</span></NavLink>
          <NavLink to="/catalog/riftbound" className={({isActive}) => isActive ? "active-link" : ""}><span>Riftbound</span></NavLink>

          <div className="nav-dropdown">
            <span className={`dropdown-trigger ${['/catalog/digimon', '/catalog/gundam', '/catalog/lotesdcarta'].includes(location.pathname) ? 'active-link' : ''}`}>Otros ⌄</span>
            <div className="dropdown-menu">
              <NavLink to="/catalog/digimon" className={({isActive}) => isActive ? "active-link" : ""}>Digimon</NavLink>
              <NavLink to="/catalog/gundam" className={({isActive}) => isActive ? "active-link" : ""}>Gundam</NavLink>
              <NavLink to="/catalog/lotesdcarta" className={({isActive}) => isActive ? "active-link" : ""}>Lotes de Cartas</NavLink>
            </div>
          </div>

          <NavLink to="/catalog/accesorios" className={({isActive}) => isActive ? "active-link" : ""}><span>Accesorios</span></NavLink>
          <NavLink to="/catalog/ofertas" className={({isActive}) => isActive ? "active-link" : ""}><span>Ofertas</span></NavLink>
          <NavLink to="/catalog/preventa" className={({isActive}) => isActive ? "active-link" : ""}><span>Preventas</span></NavLink>
          <NavLink to="/catalog/eventos" className={({isActive}) => isActive ? "active-link" : ""}><span>Eventos</span></NavLink>
        </nav>

        <div className="header-icons">
          <NavLink to="/search" style={{ color: 'inherit' }}><IonIcon icon={searchOutline} /></NavLink>
          {localStorage.getItem('role') === 'admin' && (
            <NavLink to="/admin" style={{ color: 'inherit' }} title="Panel de Control">
              <IonIcon icon={gridOutline} />
            </NavLink>
          )}
          <button onClick={handlePersonClick} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0' }}>
            <IonIcon icon={personOutline} />
          </button>
          <NavLink to="/cart" style={{ color: 'inherit' }}><IonIcon icon={cartOutline} /></NavLink>
        </div>
      </header>

      {ReactDOM.createPortal(
        <>
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
          <div className="mobile-side-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <NavLink to="/home" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="logo-placeholder">TCGStore</span>
            </NavLink>
            <IonIcon icon={closeOutline} onClick={closeMenu} className="close-menu-icon" />
          </div>
          
          <div className="mobile-menu-slider-container">
            <div className={`mobile-menu-pane ${activeSubMenu === 'main' ? 'active' : 'hidden-left'}`}>
              <div className="mobile-menu-links">
                <div className="mobile-nav-item" onClick={() => setActiveSubMenu('singles')}>
                  Singles <IonIcon icon={chevronForwardOutline} />
                </div>
                <NavLink to="/catalog/pokemon" onClick={closeMenu}>Pokemon</NavLink>
                <NavLink to="/catalog/magic" onClick={closeMenu}>Magic</NavLink>
                <NavLink to="/catalog/onepiece" onClick={closeMenu}>One Piece</NavLink>
                <NavLink to="/catalog/riftbound" onClick={closeMenu}>Riftbound</NavLink>
                
                <div className="mobile-nav-item" onClick={() => setActiveSubMenu('otros')}>
                  Otros <IonIcon icon={chevronForwardOutline} />
                </div>
                
                <NavLink to="/catalog/accesorios" onClick={closeMenu}>Accesorios</NavLink>
                <NavLink to="/catalog/ofertas" onClick={closeMenu}>Ofertas</NavLink>
                <NavLink to="/catalog/preventa" onClick={closeMenu}>Preventas</NavLink>
                <NavLink to="/catalog/eventos" onClick={closeMenu}>Eventos</NavLink>
              </div>
            </div>

            <div className={`mobile-menu-pane ${activeSubMenu === 'singles' ? 'active' : 'hidden-right'}`}>
              <div className="mobile-submenu-header" onClick={() => setActiveSubMenu('main')}>
                <IonIcon icon={chevronBackOutline} /> Volver
              </div>
              <div className="mobile-menu-links">
                <div className="mobile-nav-title">Singles</div>
                <NavLink to="/catalog/pokemon-singles" onClick={closeMenu}>Pokémon</NavLink>
                <NavLink to="/catalog/onepiece-singles" onClick={closeMenu}>One Piece</NavLink>
                <NavLink to="/catalog/riftbound-singles" onClick={closeMenu}>Riftbound</NavLink>
              </div>
            </div>

            <div className={`mobile-menu-pane ${activeSubMenu === 'otros' ? 'active' : 'hidden-right'}`}>
              <div className="mobile-submenu-header" onClick={() => setActiveSubMenu('main')}>
                <IonIcon icon={chevronBackOutline} /> Volver
              </div>
              <div className="mobile-menu-links">
                <div className="mobile-nav-title">Otros</div>
                <NavLink to="/catalog/digimon" onClick={closeMenu}>Digimon</NavLink>
                <NavLink to="/catalog/gundam" onClick={closeMenu}>Gundam</NavLink>
                <NavLink to="/catalog/lotesdcarta" onClick={closeMenu}>Lotes de Cartas</NavLink>
              </div>
            </div>
          </div>
          </div>
        </div>
        </>, document.body
      )}
    </>
  );
};

export default Header;
