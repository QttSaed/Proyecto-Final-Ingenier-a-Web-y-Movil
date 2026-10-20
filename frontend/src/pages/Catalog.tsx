import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader } from '@ionic/react';
import { optionsOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

import appData from '../data.json';
import { useLocation } from 'react-router-dom';
import { apiService, localProducts, money } from '../services/apiService';

type CatalogProduct = (typeof appData.sections)[keyof typeof appData.sections][number] & { categorySlug?: string; description?: string };

const Catalog: React.FC = () => {
  const location = useLocation();
  const [catalog, setCatalog] = useState<CatalogProduct[]>(localProducts.map(p => ({ ...p, hasButton: p.hasButton ?? true, price: money(p.price) })));
  useEffect(() => { let active = true; apiService.products().then(products => { if (active) setCatalog(products.map(p => ({ ...p, hasButton: p.hasButton ?? true, price: money(p.price) }))); }).catch(() => {}); return () => { active = false; }; }, [location.key]);
  const { category } = useParams<{ category: string }>();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('search') || '');
  const [sortBy, setSortBy] = useState('Más reciente');
  const attributes = [
    ['category', 'Categoría'], ['game', 'Juego'], ['edition', 'Edición'], ['rarity', 'Rareza'],
    ['color', 'Color'], ['cost', 'Costo (CLP)'], ['cardType', 'Tipo'], ['condition', 'Condición']
  ] as const;
  const [filters, setFilters] = useState<Record<string, string>>({});

  const normalize = (s: string) => (s || '').toLowerCase().replace(/[\s-]/g, '');

  const isSinglesQuery = !!category && category.endsWith('-singles');
  const baseCategoryName = isSinglesQuery ? category.replace('-singles', '') : category || '';
  const normalizedBase = normalize(baseCategoryName);

  let categoryProducts: CatalogProduct[] = [];

  if (normalizedBase === 'todos') {
    categoryProducts = [...catalog];
  } else if (normalizedBase === 'ofertas') {
    const allProducts = [...catalog];
    categoryProducts = allProducts.sort((a, b) => {
      const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 999999;
      const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 999999;
      return pA - pB;
    }).slice(0, 36);
  } else {
    const allFromSection = catalog.filter(p => normalize(p.category) === normalizedBase || normalize(p.categorySlug || '') === normalizedBase);
    if (isSinglesQuery) {
      const sealedWords = ['caja', 'sobre', 'mazo', 'pack', 'kit', 'set', 'booster', 'starter', 'box'];
      categoryProducts = allFromSection.filter((p) =>
        !sealedWords.some(w => p.title.toLowerCase().includes(w))
      );
    } else {
      categoryProducts = allFromSection;
    }
  }

  if (searchQuery.trim() !== '') {
    categoryProducts = categoryProducts.filter((p) =>
      `${p.title} ${p.description || ''}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }

  const filterProducts = [...categoryProducts];
  categoryProducts = categoryProducts.filter(product => attributes.every(([key]) => !filters[key] || String(product[key]) === filters[key]));
  categoryProducts = [...categoryProducts];

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
    setSearchQuery(new URLSearchParams(location.search).get('search') || '');
    setFilters({});
  }, [category, location.search]);

  // Al cambiar productos por pagina, volver a pagina 1
  const handlePerPageChange = (val: number) => {
    setProductsPerPage(val);
    setCurrentPage(1);
    contentRef.current?.scrollToTop(300);
  };

  const formatTitle = (cat?: string) => {
    if (!cat || cat === 'todos') return 'Catálogo';
    if (cat.endsWith('-singles')) return `${cat.replace('-singles', '')} (Singles)`;
    return cat;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      contentRef.current?.scrollToTop(300);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <TopBar />
        <Header />
      </IonHeader>
      <IonContent ref={contentRef} className="main-content">
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
              aria-label="Buscar productos" placeholder="Buscar productos..."
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
                    {attributes.map(([key, label]) => (
                      <div className="filter-group" key={key}>
                        <label htmlFor={`filter-${key}`}>{label}</label>
                        <select id={`filter-${key}`} className="filter-select" value={filters[key] || ''} onChange={e => { setFilters(previous => ({ ...previous, [key]: e.target.value })); setCurrentPage(1); }}>
                          <option value="">Todas</option>
                          {Array.from(new Set(filterProducts.map(product => String(product[key])))).sort().map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                      </div>
                    ))}
                    <button onClick={() => { setFilters({}); setCurrentPage(1); }}>Limpiar filtros</button>
                  <button className="btn-apply-filters" onClick={() => { setShowFilters(false); contentRef.current?.scrollToTop(0); }}>Aplicar</button>
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
                {productsToDisplay.map((p) => (
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
