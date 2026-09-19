import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonIcon, IonButton } from '@ionic/react';
import { logOutOutline, bagHandleOutline, personOutline, mailOutline, callOutline, mapOutline } from 'ionicons/icons';
import { Navigate, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthorized] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const role = localStorage.getItem('role') || 'guest';

  if (!isAuthorized) {
    return <Navigate to="/home" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <TopBar />
        <Header />
      </IonHeader>
      <IonContent className="main-content">
        <div className="profile-container">
          <h1 className="profile-title">Mi Cuenta</h1>

          <div className={`profile-grid ${role === 'admin' ? 'admin-layout' : ''}`}>
            <div className="profile-card user-info">
              <div className="profile-card-banner">
                <div className="profile-avatar">
                  <IonIcon icon={personOutline} />
                </div>
              </div>
              <div className="profile-details-container">
                <h2 className="profile-name">{localStorage.getItem('userName') || 'Usuario Invitado'}</h2>
                <p className="profile-role-badge">{role === 'admin' ? 'Administrador' : 'Cliente'}</p>

                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <IonIcon icon={mailOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Correo Electrónico</span>
                      <span className="info-value">{localStorage.getItem('userEmail') || 'correo@tcgstore.com'}</span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <IonIcon icon={callOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Teléfono</span>
                      <span className="info-value">+56 9 1234 5678</span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <IonIcon icon={mapOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Dirección de Envío</span>
                      <span className="info-value">Av. Siempre Viva 742, Santiago</span>
                    </div>
                  </div>
                </div>

                <IonButton fill="outline" expand="block" className="logout-btn" onClick={handleLogout}>
                  <IonIcon slot="start" icon={logOutOutline} />
                  Cerrar Sesión
                </IonButton>
              </div>
            </div>

            {role !== 'admin' && (
              <div className="profile-card user-orders">
                <div className="card-header">
                  <IonIcon icon={bagHandleOutline} />
                  <h2>Mis Órdenes</h2>
                </div>
                <div className="card-body">

                  <div className="order-item">
                    <div className="order-header">
                      <span className="order-id">#ORD-94A2X</span>
                      <span className="order-date">18 Sept 2026</span>
                    </div>
                    <div className="order-details">
                      <span>3 Productos</span>
                      <span className="order-total">$64.000</span>
                    </div>
                    <div className="order-status status-transit">En tránsito</div>
                  </div>

                  <div className="order-item">
                    <div className="order-header">
                      <span className="order-id">#ORD-28B4L</span>
                      <span className="order-date">02 Sept 2026</span>
                    </div>
                    <div className="order-details">
                      <span>1 Producto</span>
                      <span className="order-total">$150.000</span>
                    </div>
                    <div className="order-status status-delivered">Entregado</div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
