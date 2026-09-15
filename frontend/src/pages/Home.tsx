import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Home.css';

// Componentes extraídos
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategoryPill from '../components/CategoryPill';

const Home: React.FC = () => {
  
  // Arreglos de datos falsos para mapear
  const mockProductsNoBtn = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    title: `Nombre del Producto ${i + 1} - Detalles Extra`,
    price: '$9.990',
    hasButton: false
  }));

  const mockProductsWithBtn = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 5,
    title: `Nombre del Producto ${i + 1} - Detalles Extra`,
    price: '$9.990',
    hasButton: true
  }));

  const categories = [
    { title: 'Pokémon TCG', subtitle: 'Cartas sueltas' },
    { title: 'Pokémon TCG', subtitle: 'Productos sellados' },
    { title: 'One Piece TCG', subtitle: 'Cartas sueltas' },
    { title: 'One Piece TCG', subtitle: 'Productos sellados' },
    { title: 'Pokémon TCG', subtitle: 'Cartas japonesas' },
    { title: 'Riftbound', subtitle: 'Cartas sueltas' }
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="main-content">
        
        <TopBar />
        <Header />

        {/* Grilla de Banners (Hero Section) */}
        <div className="banners-container">
          <div className="banner-large">
            <div className="banner-placeholder">Banner Principal (Ej: Pitch Black)</div>
          </div>
          <div className="banner-grid-small">
            <div className="banner-small">Banner Accesorios</div>
            <div className="banner-small">Banner Pincha Aquí</div>
            <div className="banner-small">Banner Gradeadas</div>
            <div className="banner-small">Banner Hololive</div>
          </div>
        </div>

        {/* Cajas de Categorías Inferiores */}
        <div className="categories-row">
          {categories.map((cat, i) => (
            <CategoryPill key={i} title={cat.title} subtitle={cat.subtitle} />
          ))}
        </div>

        {/* Barra de Descuento */}
        <div className="discount-bar">
          USA EL CÓDIGO "PROMO" Y APROVECHA UN 5% DE DESCUENTO EN TUS SINGLES!!
        </div>

        {/* TCG Favorito (Iconos Circulares) */}
        <div className="section-container">
          <h2 className="section-title">Elige tu TCG favorito &lt;3</h2>
          <div className="circular-icons-row">
            {['Pokemon', 'One Piece', 'Riftbound', 'Magic', 'Digimon', 'Gundam', 'Lotes'].map((juego, i) => (
              <Link to={`/catalog/${juego.toLowerCase().replace(' ', '')}`} key={i} style={{textDecoration: 'none'}}>
                <div className="circular-icon">
                  <div className="circle-placeholder"></div>
                  <span className="circle-label">{juego}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sobres Sueltos */}
        <div className="section-container">
          <h2 className="section-title">Sobres Sueltos de tus TCG favoritos</h2>
          <div className="product-grid">
            {mockProductsNoBtn.map(p => (
              <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} hasButton={p.hasButton} />
            ))}
          </div>
        </div>

        {/* Singles Riftbound */}
        <div className="section-container">
          <h2 className="section-title">Singles Riftbound</h2>
          <div className="product-grid">
            {mockProductsNoBtn.map(p => (
              <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} hasButton={p.hasButton} />
            ))}
          </div>
          <div className="pagination-controls">
            <span>&lt; 1/3 &gt;</span>
            <Link to="/catalog/riftbound-singles">
              <button className="btn-view-all">Ver todo</button>
            </Link>
          </div>
        </div>

        {/* Singles Pokémon */}
        <div className="section-container">
          <h2 className="section-title">Singles Pokémon</h2>
          <div className="product-grid">
            {mockProductsWithBtn.map(p => (
              <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} hasButton={p.hasButton} />
            ))}
          </div>
          <div className="pagination-controls">
            <span>&lt; 1/8 &gt;</span>
            <Link to="/catalog/pokemon-singles">
              <button className="btn-view-all">Ver todo</button>
            </Link>
          </div>
        </div>

        <Footer />

      </IonContent>
    </IonPage>
  );
};

export default Home;
