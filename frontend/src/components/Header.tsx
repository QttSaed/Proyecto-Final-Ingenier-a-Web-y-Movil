import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IonIcon } from '@ionic/react';
import { searchOutline, personOutline, cartOutline, menuOutline, closeOutline, chevronForwardOutline, chevronBackOutline, gridOutline } from 'ionicons/icons';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { apiService, Product, money } from '../services/apiService';
import { useAuth } from '../services/authService';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'singles' | 'otros'>('main');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    setResults([]);
    setSearchError('');
    setSearchLoading(query.trim().length >= 2);
    if (query.trim().length < 2) return;
    const timer = window.setTimeout(() => {
      apiService.products(query.trim()).then(products => { if (active) setResults(products.slice(0, 6)); })
        .catch(() => { if (active) setSearchError('No se pudo realizar la búsqueda'); })
        .finally(() => { if (active) setSearchLoading(false); });
    }, 200);
    return () => { active = false; window.clearTimeout(timer); };
  }, [query]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSearchOpen(false); setMobileSearch(false); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  const goToSearch = (path: string) => {
    setSearchOpen(false); setQuery(''); setMobileSearch(false); navigate(path);
  };
  const allResults = () => { if (query.trim()) goToSearch(`/catalog/todos?search=${encodeURIComponent(query.trim())}`); };

  const handlePersonClick = () => {
    if (user) {
      navigate('/perfil');
    } else {
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setActiveSubMenu('main');
  };
  
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => setActiveSubMenu('main'), 300);
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
          <NavLink to="/catalog/todos" className={({isActive}) => isActive ? "active-link" : ""}><span>Todos los productos</span></NavLink>
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
            <span className={`dropdown-trigger ${['/catalog/digimon', '/catalog/gundam', '/catalog/lotes-de-cartas', '/catalog/lotesdcarta'].includes(location.pathname) ? 'active-link' : ''}`}>Otros ⌄</span>
            <div className="dropdown-menu">
              <NavLink to="/catalog/digimon" className={({isActive}) => isActive ? "active-link" : ""}>Digimon</NavLink>
              <NavLink to="/catalog/gundam" className={({isActive}) => isActive ? "active-link" : ""}>Gundam</NavLink>
              <NavLink to="/catalog/lotes-de-cartas" className={({isActive}) => isActive ? "active-link" : ""}>Lotes de Cartas</NavLink>
            </div>
          </div>

          <NavLink to="/catalog/accesorios" className={({isActive}) => isActive ? "active-link" : ""}><span>Accesorios</span></NavLink>
          <NavLink to="/catalog/ofertas" className={({isActive}) => isActive ? "active-link" : ""}><span>Ofertas</span></NavLink>
          <NavLink to="/catalog/preventa" className={({isActive}) => isActive ? "active-link" : ""}><span>Preventas</span></NavLink>
          <NavLink to="/catalog/eventos" className={({isActive}) => isActive ? "active-link" : ""}><span>Eventos</span></NavLink>
        </nav>

        <div ref={searchRef} className={`header-search ${mobileSearch ? 'expanded' : ''}`}>
          <form className="header-search-form" role="search" onSubmit={event => { event.preventDefault(); allResults(); }}>
            <IonIcon icon={searchOutline} />
            <input ref={inputRef} aria-label="Buscar productos" placeholder="Buscar cartas, accesorios, mazos..." maxLength={200}
              value={query} onFocus={() => setSearchOpen(true)} onChange={event => { setQuery(event.target.value); setSearchOpen(true); }} />
            {query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { setQuery(''); inputRef.current?.focus(); }}><IonIcon icon={closeOutline} /></button>}
          </form>
          {searchOpen && query.trim().length >= 2 && <div className="search-results-dropdown" aria-live="polite">
            {searchLoading ? <p>Buscando productos...</p> : searchError ? <p>{searchError}</p> : results.length ? <>
              {results.map(product => <Link key={product.id} to={`/product/${encodeURIComponent(product.id)}`} onClick={event => { event.preventDefault(); goToSearch(`/product/${encodeURIComponent(product.id)}`); }} className="search-result-item">
                <img src={product.image} alt="" /><span><strong>{product.title}</strong><small>{product.game} · {product.category}</small></span><b>{money(product.price)}</b>
              </Link>)}
              <button className="search-all-results" onClick={allResults}>Ver todos los resultados para “{query.trim()}”</button>
            </> : <p>No se encontraron productos para “{query.trim()}”.</p>}
          </div>}
        </div>
        <div className="header-icons">
          <button className="mobile-search-toggle" aria-label="Alternar búsqueda" aria-expanded={mobileSearch} onClick={() => { setMobileSearch(!mobileSearch); setSearchOpen(true); if (!mobileSearch) requestAnimationFrame(() => inputRef.current?.focus()); }}><IonIcon icon={searchOutline} /></button>
          {user?.role === 'admin' && (
            <NavLink to="/admin" style={{ color: 'inherit' }} title="Panel de Control">
              <IonIcon icon={gridOutline} />
            </NavLink>
          )}
          <button onClick={handlePersonClick} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0' }}>
            <IonIcon icon={personOutline} />
          </button>
          <NavLink to={user?.role === 'admin' ? '/admin' : '/cart'} style={{ color: 'inherit' }}><IonIcon icon={cartOutline} /></NavLink>
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
                <NavLink to="/catalog/todos" onClick={closeMenu}>Todos los productos</NavLink>
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
                <NavLink to="/catalog/lotes-de-cartas" onClick={closeMenu}>Lotes de Cartas</NavLink>
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
