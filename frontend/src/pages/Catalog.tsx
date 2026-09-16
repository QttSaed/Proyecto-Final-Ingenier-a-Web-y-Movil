import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

import appData from '../data.json';

const Catalog: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const normalize = (s: string) => (s || '').toLowerCase().replace(/[\s-]/g, '');
  
  const isSinglesQuery = !!category && category.endsWith('-singles');
  const baseCategoryName = isSinglesQuery ? category.replace('-singles', '') : category || '';
  const normalizedBase = normalize(baseCategoryName);
  
  let categoryProducts: any[] = [];
  let matchedSectionKey: string | undefined = undefined;

  if (normalizedBase === 'ofertas') {
    const allProducts = Object.values(appData.sections).flat();
    categoryProducts = allProducts.sort((a: any, b: any) => {
      const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 999999;
      const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 999999;
      return pA - pB;
    }).slice(0, 36);
  } else {
    matchedSectionKey = Object.keys(appData.sections).find(k => normalize(k) === normalizedBase);
    let allFromSection = matchedSectionKey ? appData.sections[matchedSectionKey as keyof typeof appData.sections] : [];
    
    if (isSinglesQuery) {
      // Filtrar aquellos que sean sobres, cajas, mazos, etc.
      const sealedWords = ['caja', 'sobre', 'mazo', 'pack', 'kit', 'set', 'booster', 'starter', 'box'];
      categoryProducts = allFromSection.filter((p: any) => {
        const lowerTitle = p.title.toLowerCase();
        return !sealedWords.some(word => lowerTitle.includes(word));
      });
    } else {
      categoryProducts = allFromSection;
    }
  }

  const totalProducts = categoryProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));

  // Precios fijos fallback en caso de no tener productos
  const basePrices = [4990, 7990, 9990, 12990, 15990, 3490, 5990, 8490, 11990, 14990, 6990, 10990];

  const productsToDisplay = categoryProducts.length > 0 
    ? categoryProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
    : Array.from({ length: productsPerPage }).map((_, i) => {
        const productIndex = (currentPage - 1) * productsPerPage + i + 1;
        return {
          id: productIndex.toString(),
          title: `${formatCategoryName(category)} - Carta #${productIndex}`,
          price: `$${basePrices[i % basePrices.length].toLocaleString('es-CL')}`,
          image: undefined,
          hasButton: true
        };
      });

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

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
    if (normalizedBase === 'ofertas') return 'Ofertas Especiales';
    
    let baseName = matchedSectionKey || formatCategoryName(baseCategoryName);
    if (matchedSectionKey) {
      const lower = matchedSectionKey.toLowerCase();
      if (lower === 'eventos') baseName = 'Eventos';
      if (lower === 'lotesdcarta') baseName = 'Lotes De Cartas';
    }
    
    if (isSinglesQuery) {
      return `Singles de ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
    }
    return baseName;
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
            <Link to="/home" style={{ color: '#1b1642', textDecoration: 'none' }}>Inicio</Link> / <span style={{textTransform: 'capitalize'}}>{formatTitle(category)}</span>
          </p>

          <div className="catalog-header">
            <div>
              <h1 className="catalog-title" style={{textTransform: 'capitalize'}}>{formatTitle(category)}</h1>
              <span className="catalog-results">Mostrando {totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, Math.max(totalProducts, productsPerPage))} de {Math.max(totalProducts, productsPerPage)} productos</span>
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
            {productsToDisplay.map((p: any) => (
              <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} image={p.image} hasButton={p.hasButton} />
            ))}
          </div>

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
