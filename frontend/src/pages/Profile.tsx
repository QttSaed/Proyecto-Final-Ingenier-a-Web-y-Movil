import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonIcon, IonButton } from '@ionic/react';
import { logOutOutline, bagHandleOutline, personOutline, mailOutline, callOutline, mapOutline } from 'ionicons/icons';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Profile.css';
import { apiService, ApiError, Order, money } from '../services/apiService';
import { localOrderService } from '../services/localOrderService';
import { Link } from 'react-router-dom';
import { authService, useAuth } from '../services/authService';

const Profile: React.FC = () => {

  const user = useAuth();
  const role = user?.role;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    setOrders([]);
    setError('');
    setOffline(false);
    if (role !== 'client' || !user) return;
    setLoading(true);
    apiService.orders().then(result => {
      if (active) setOrders(result);
    }).catch(requestError => {
      if (!active) return;
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setOrders(localOrderService.orders(user.email));
        setOffline(true);
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [role, user]);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
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
                <h2 className="profile-name">{user?.name || 'Usuario Invitado'}</h2>
                <p className="profile-role-badge">{role === 'admin' ? 'Administrador' : 'Cliente'}</p>

                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <IonIcon icon={mailOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Correo Electrónico</span>
                      <span className="info-value">{user?.email || 'correo@tcgstore.com'}</span>
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

                  {loading && <p role="status">Cargando tus órdenes…</p>}
                  {error && <p role="alert">{error}</p>}
                  {offline && <p>Sin conexión: mostrando las órdenes guardadas en este dispositivo.</p>}
                  {!loading && !error && orders.length === 0 && (
                    <p>Aún no tienes órdenes. <Link to="/catalog/todos">Explora el catálogo</Link> y encuentra tus próximas cartas.</p>
                  )}
                  {orders.map(order => {
                    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <div className="order-item" key={order.id}>
                        <div className="order-header">
                          <span className="order-id">#{order.orderNumber || order.id}</span>
                          <span className="order-date">{new Date(order.date).toLocaleDateString('es-CL')}</span>
                        </div>
                        <div className="order-details">
                          <span>{quantity} {quantity === 1 ? 'Producto' : 'Productos'}</span>
                          <span className="order-total">{money(order.total)}</span>
                        </div>
                        <div className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</div>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </IonContent>
    </>
  );
};

export default Profile;

