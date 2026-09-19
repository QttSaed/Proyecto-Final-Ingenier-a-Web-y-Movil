import React from 'react';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ComingSoon.css';

const ComingSoon: React.FC = () => {
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
            <div className="coming-soon-icon">🚧</div>
            <h1>Próximamente</h1>
            <p>
              ¡Hola! Esta sección de la tienda aún se encuentra en construcción.
              Nuestro equipo de desarrollo está trabajando arduamente para tenerla lista pronto.
            </p>
            <p className="coming-soon-subtitle">
              Gracias por tu paciencia.
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

export default ComingSoon;

