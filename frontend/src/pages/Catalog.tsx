import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

const Catalog: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const totalProducts = 36; // simulamos 36 productos en total
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Precios fijos para que no cambien al re-renderizar
  const basePrices = [4990, 7990, 9990, 12990, 15990, 3490, 5990, 8490, 11990, 14990, 6990, 10990];

  // Generamos productos mock según la página actual
  const mockProducts = Array.from({ length: productsPerPage }).map((_, i) => {
    const productIndex = (currentPage - 1) * productsPerPage + i + 1;
    return {
      id: productIndex,
      title: `${formatCategoryName(category)} - Carta #${productIndex}`,
      price: `$${basePrices[i % basePrices.length].toLocaleString('es-CL')}`,
      hasButton: true
    };
  });

  function formatCategoryName(cat?: string): string {
    if (!cat) return 'General';
    return cat
      .replace('-singles', ' Singles')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  function formatTitle(cat?: string): string {
    if (!cat) return 'Todos los productos';
    if (cat.endsWith('-singles')) {
      const name = cat.replace('-singles', '');
      return `Singles de ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    }
    return formatCategoryName(cat);
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll arriba al cambiar de página
      document.querySelector('ion-content')?.scrollToTop(300);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="main-content">
        <TopBar />
        <Header />

        <div className="catalog-container">
          <p className="detail-breadcrumb" style={{ marginBottom: '20px', color: '#888', fontSize: '0.85rem' }}>
            <Link to="/home" style={{ color: '#1b1642', textDecoration: 'none' }}>Inicio</Link> / {formatTitle(category)}
          </p>

          <div className="catalog-header">
            <div>
              <h1 className="catalog-title">{formatTitle(category)}</h1>
              <span className="catalog-results">Mostrando {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} de {totalProducts} productos</span>
            </div>
          </div>

          <div className="catalog-filters">
            <input className="catalog-search" type="text" placeholder="Buscar en esta categoría..." />
            <select className="filter-select">
              <option>Ordenar por: Más reciente</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Nombre: A - Z</option>
            </select>
            <select className="filter-select">
              <option>Condición: Todas</option>
              <option>Near Mint</option>
              <option>Lightly Played</option>
              <option>Moderately Played</option>
            </select>
            <select className="filter-select">
              <option>Rareza: Todas</option>
              <option>Common</option>
              <option>Uncommon</option>
              <option>Rare</option>
              <option>Ultra Rare</option>
            </select>
          </div>

          <div className="catalog-grid">
            {mockProducts.map(p => (
              <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} hasButton={p.hasButton} />
            ))}
          </div>

          {/* Paginación funcional */}
          <div className="catalog-pagination">
            <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              ← Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Siguiente →
            </button>
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Catalog;
