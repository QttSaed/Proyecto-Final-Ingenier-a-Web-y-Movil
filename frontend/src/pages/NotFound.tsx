import React from 'react';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ComingSoon.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <TopBar />
        <Header />
      </IonHeader>
      <IonContent className="main-content">
        <div className="coming-soon-container">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🔍</div>
            <h1>404 - Página no encontrada</h1>
            <p>
              La ruta que estás buscando no existe o fue movida dentro de TCGStore.
            </p>
            <p className="coming-soon-subtitle">
              Revisa la dirección o vuelve al catálogo principal para seguir explorando.
            </p>
            <button className="btn-back-home" onClick={() => navigate('/home')}>
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
