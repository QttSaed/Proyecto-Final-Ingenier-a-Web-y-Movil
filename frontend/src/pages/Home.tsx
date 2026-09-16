import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Home.css';

import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import appData from '../data.json';

const Home: React.FC = () => {
  const getSectionTitle = (name: string, count: number) => {
    const lowerName = name.toLowerCase();
    if (lowerName === 'eventos') return 'Eventos';
    if (lowerName === 'lotesdcarta') return 'Lotes De Cartas';
    return `Artículos de ${name} (${count})`;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="main-content">
        
        <TopBar />
        <Header />

        <div className="banners-container">
          <div className="banner-large" style={{ backgroundImage: `url('${appData.banners[0]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
          <div className="banner-grid-small">
            {appData.banners.slice(1, 5).map((bannerUrl, idx) => (
               <div key={idx} className="banner-small" style={{ backgroundImage: `url('${bannerUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            ))}
          </div>
        </div>

        <div className="discount-bar">
          USA EL CÓDIGO "PROMO" Y APROVECHA UN 5% DE DESCUENTO EN TUS SINGLES!!
        </div>

        <div className="section-container">
          <h2 className="section-title">Elige tu TCG favorito &lt;3</h2>
          <div className="circular-icons-row">
            {appData.logos.map((logo, i) => {
              const cleanName = logo.name.replace(/icono /i, '');
              let targetId = cleanName.toLowerCase().replace(/[\s-]/g, '');
              if (targetId === 'lotes') targetId = 'lotesdcarta';

              return (
                <div 
                  key={i} 
                  style={{textDecoration: 'none', cursor: 'pointer'}} 
                  onClick={() => {
                    const el = document.getElementById(`section-${targetId}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="circular-icon">
                    <div className="circle-placeholder" style={{ backgroundImage: `url('${logo.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'none' }}></div>
                    <span className="circle-label" style={{textTransform: 'capitalize'}}>{cleanName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {Object.entries(appData.sections).map(([sectionName, products], idx) => {
          const sectionId = sectionName.toLowerCase().replace(/[\s-]/g, '');
          return (
            <div className="section-container" key={idx} id={`section-${sectionId}`}>
              <h2 className="section-title" style={{textTransform: 'capitalize'}}>{getSectionTitle(sectionName, products.length)}</h2>
              <div className="product-grid">
                {products.map(p => (
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
              <div className="pagination-controls">
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
