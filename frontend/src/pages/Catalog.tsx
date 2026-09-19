import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader } from '@ionic/react';
import { optionsOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

import appData from '../data.json';

const Catalog: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Más reciente');
  const [filterCondition, setFilterCondition] = useState('Todas');
  const [filterRarity, setFilterRarity] = useState('Todas');

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
    const allFromSection = matchedSectionKey ? appData.sections[matchedSectionKey as keyof typeof appData.sections] : [];
    if (isSinglesQuery) {
      const sealedWords = ['caja', 'sobre', 'mazo', 'pack', 'kit', 'set', 'booster', 'starter', 'box'];
      categoryProducts = allFromSection.filter((p: any) =>
        !sealedWords.some(w => p.title.toLowerCase().includes(w))
      );
    } else {
      categoryProducts = allFromSection;
    }
  }

  if (searchQuery.trim() !== '') {
    categoryProducts = categoryProducts.filter((p: any) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Simulated filters (since data.json doesn't have these fields, 
  // it will only work if the JSON is updated, but logic is 100% ready)
  if (filterCondition !== 'Todas') {
    categoryProducts = categoryProducts.filter((p: any) => p.condition === filterCondition);
  }
  if (filterRarity !== 'Todas') {
    categoryProducts = categoryProducts.filter((p: any) => p.rarity === filterRarity);
  }

  // Sort logic (Real, as data.json has prices and titles)
  if (sortBy === 'Precio: Menor a Mayor') {
    categoryProducts.sort((a, b) => {
      const pA = parseInt((a.price || '0').replace(/[^0-9]/g, ''));
      const pB = parseInt((b.price || '0').replace(/[^0-9]/g, ''));
      return pA - pB;
    });
  } else if (sortBy === 'Precio: Mayor a Menor') {
    categoryProducts.sort((a, b) => {
      const pA = parseInt((a.price || '0').replace(/[^0-9]/g, ''));
      const pB = parseInt((b.price || '0').replace(/[^0-9]/g, ''));
      return pB - pA;
    });
  } else if (sortBy === 'Nombre: A - Z') {
    categoryProducts.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  const totalProducts = categoryProducts.length;
  const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / productsPerPage) : 1;

  const pageStart = (currentPage - 1) * productsPerPage;
  const productsToDisplay = totalProducts > 0
    ? categoryProducts.slice(pageStart, pageStart + productsPerPage)
    : [];

  const firstShown = totalProducts === 0 ? 0 : pageStart + 1;
  const lastShown = totalProducts === 0 ? 0 : Math.min(pageStart + productsPerPage, totalProducts);

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
  }, [category]);

  // Al cambiar productos por pagina, volver a pagina 1
  const handlePerPageChange = (val: number) => {
    setProductsPerPage(val);
    setCurrentPage(1);
    document.querySelector('ion-content')?.scrollToTop(300);
  };

  const formatTitle = (cat?: string) => {
    if (!cat) return 'Catálogo';
    if (cat.endsWith('-singles')) return `${cat.replace('-singles', '')} (Singles)`;
    return cat;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.querySelector('ion-content')?.scrollToTop(300);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <TopBar />
        <Header />
      </IonHeader>
      <IonContent className="main-content">
        <div className="catalog-container">

          <div className="catalog-header">
            <div>
              <h1 className="catalog-title" style={{ textTransform: 'capitalize' }}>{formatTitle(category)}</h1>
              <span className="catalog-results">
                {totalProducts === 0
                  ? 'Sin productos en esta categoría'
                  : `Mostrando ${firstShown}–${lastShown} de ${totalProducts} productos`}
              </span>
            </div>
            {totalProducts > 0 && (
              <div className="per-page-selector">
                <span className="per-page-label">Mostrar:</span>
                {[12, 24, 36].map(n => (
                  <button
                    key={n}
                    className={`per-page-btn ${productsPerPage === n ? 'active' : ''}`}
                    onClick={() => handlePerPageChange(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="catalog-filters-bar">
            <input 
              className="catalog-search" 
              type="text" 
              placeholder="Buscar en esta categoría..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="filter-dropdown-container">
              <button className="btn-filter-trigger" onClick={() => setShowFilters(!showFilters)}>
                <IonIcon icon={optionsOutline} /> Filtros Avanzados
              </button>
              {showFilters && (
                <div className="filter-dropdown-menu">
                    <div className="filter-group">
                      <label>Ordenar por</label>
                      <select className="filter-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                        <option>Más reciente</option>
                        <option>Precio: Menor a Mayor</option>
                        <option>Precio: Mayor a Menor</option>
                        <option>Nombre: A - Z</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Condición</label>
                      <select className="filter-select" value={filterCondition} onChange={(e) => { setFilterCondition(e.target.value); setCurrentPage(1); }}>
                        <option>Todas</option>
                        <option>Near Mint</option>
                        <option>Lightly Played</option>
                        <option>Moderately Played</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Rareza</label>
                      <select className="filter-select" value={filterRarity} onChange={(e) => { setFilterRarity(e.target.value); setCurrentPage(1); }}>
                        <option>Todas</option>
                        <option>Common</option>
                        <option>Uncommon</option>
                        <option>Rare</option>
                        <option>Ultra Rare</option>
                      </select>
                    </div>
                  <button className="btn-apply-filters" onClick={() => setShowFilters(false)}>Aplicar</button>
                </div>
              )}
            </div>
          </div>

          {totalProducts === 0 ? (
            <div className="catalog-empty">
              <p>No hay productos en esta categoría todavía.</p>
            </div>
          ) : (
            <>
              <div className="catalog-grid">
                {productsToDisplay.map((p: any) => (
                  <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} image={p.image} hasButton={p.hasButton} />
                ))}
              </div>

              {totalPages > 1 && (
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
              )}
            </>
          )}
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Catalog;
