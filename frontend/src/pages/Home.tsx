import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Home.css';

import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import appData from '../data.json';

const Home: React.FC = () => {
  // Estado para la paginación funcional del Home
  const [pageState, setPageState] = useState<Record<string, number>>({});

  const getSectionTitle = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName === 'eventos') return 'Eventos';
    if (lowerName === 'lotesdcarta') return 'Lotes De Cartas';
    return name;
  };

  return (
    <IonPage>
      <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">

        <div className="banners-container">
          <Link to="/catalog/gundam" className="banner-large" style={{ padding: 0, textDecoration: 'none' }}>
            <img src={appData.banners[0]} alt="Banner Principal Gundam" className="banner-img-inner" />
          </Link>
          <div className="banner-grid-small">
            {appData.banners.slice(1, 5).map((bannerUrl, idx) => {
               // Mapeo manual según la posición solicitada
               const paths = ['/catalog/magic', '/catalog/onepiece', '/catalog/pokemon', '/catalog/riftbound'];
               return (
                 <Link to={paths[idx]} key={idx} className="banner-small" style={{ padding: 0, textDecoration: 'none' }}>
                   <img src={bannerUrl} alt={`Banner ${idx}`} className="banner-img-inner" />
                 </Link>
               );
            })}
          </div>
        </div>

        <div className="discount-bar">
          USA EL CÓDIGO "PROMO" Y APROVECHA UN 5% DE DESCUENTO EN TUS SINGLES!!
        </div>

        <div className="section-container">
          <h2 className="section-title">Elige tu TCG favorito &lt;3</h2>
          <div className="circular-icons-row">
            {appData.logos.sort((a, b) => {
              const order = ['pokemon', 'one piece', 'riftbound', 'magic', 'digimon', 'gundam', 'lotes'];
              const nameA = a.name.replace(/icono /i, '').toLowerCase();
              const nameB = b.name.replace(/icono /i, '').toLowerCase();
              let indexA = order.indexOf(nameA);
              let indexB = order.indexOf(nameB);
              // Si no están en la lista de orden, mandarlos al final
              if (indexA === -1) indexA = 999;
              if (indexB === -1) indexB = 999;
              return indexA - indexB;
            }).map((logo, i) => {
              const cleanName = logo.name.replace(/icono /i, '');
              let targetId = cleanName.toLowerCase().replace(/[\s-]/g, '');
              if (targetId === 'lotes') targetId = 'lotesdcarta';

              return (
                <Link to={`/catalog/${targetId}`} key={i} style={{textDecoration: 'none'}}>
                  <div className="circular-icon">
                    <div className="circle-placeholder" style={{ backgroundImage: `url('${logo.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <span className="circle-label" style={{textTransform: 'capitalize'}}>{cleanName}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {Object.entries(appData.sections).map(([sectionName, products], idx) => {
          const sectionId = sectionName.toLowerCase().replace(/[\s-]/g, '');
          const itemsPerPage = 5;
          const currentPage = pageState[sectionId] || 1;
          const totalPages = Math.ceil(products.length / itemsPerPage);
          
          const startIndex = (currentPage - 1) * itemsPerPage;
          const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

          const handlePrev = () => {
            if (currentPage > 1) {
              setPageState(prev => ({ ...prev, [sectionId]: currentPage - 1 }));
            }
          };

          const handleNext = () => {
            if (currentPage < totalPages) {
              setPageState(prev => ({ ...prev, [sectionId]: currentPage + 1 }));
            }
          };

          // Alternate background classes for visual interest
          const bgClass = idx % 2 === 0 ? 'section-bg-alt' : '';

          return (
            <div className={`section-container ${bgClass}`} key={idx} id={`section-${sectionId}`}>
              <h2 className="section-title" style={{textTransform: 'capitalize'}}>{getSectionTitle(sectionName)}</h2>
              <div className="product-grid">
                {visibleProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    id={p.id} 
                    title={p.title} 
                    price={p.price} 
                    image={p.image}
                    hasButton={p.hasButton} 
                  />
                ))}
              </div>
              <div className="pagination-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                <div className="pagination-arrows" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button onClick={handlePrev} disabled={currentPage === 1} style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', padding: '5px 15px', borderRadius: '5px', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', color: 'var(--color-text-dark)', fontWeight: 'bold' }}>&lt;</button>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{currentPage} / {totalPages || 1}</span>
                  <button onClick={handleNext} disabled={currentPage === totalPages} style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', padding: '5px 15px', borderRadius: '5px', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', color: 'var(--color-text-dark)', fontWeight: 'bold' }}>&gt;</button>
                </div>
                <Link to={`/catalog/${sectionId}`}>
                  <button className="btn-view-all">Ver todo</button>
                </Link>
              </div>
            </div>
          );
        })}

        <Footer />

      </IonContent>
    </IonPage>
  );
};

export default Home;

