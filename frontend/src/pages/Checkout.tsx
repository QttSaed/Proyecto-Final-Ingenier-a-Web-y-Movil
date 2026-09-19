import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, useIonViewWillEnter } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, ellipseOutline, homeOutline } from 'ionicons/icons';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  // Reiniciar estado cuando la vista va a entrar (por el caché de Ionic)
  useIonViewWillEnter(() => {
    setIsSuccess(false);
  });

  // Cálculos del resumen
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 3500;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFinalTotal(total); // Guardamos el total ANTES de limpiar el carrito
    setIsSuccess(true);
    clearCart(); // Limpiamos el carrito al pagar con exito
  };

  if (isSuccess) {
    return (
      <IonPage>
        <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">
          <div className="checkout-success-container">
            <div className="success-card">
              <h2>🎉 ¡Orden Generada con Éxito!</h2>
              <p>Tu pago por <strong>{formatPrice(finalTotal)}</strong> ha sido procesado correctamente.</p>
              <p>Te hemos enviado un correo con los detalles de tu orden y el número de seguimiento.</p>
              <button className="btn-back-home" onClick={() => {
                setIsSuccess(false);
                navigate('/home');
              }}>
                <IonIcon icon={homeOutline} style={{ verticalAlign: "middle", marginRight: "8px" }} />Volver a la Tienda</button>
            </div>
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">

        <div className="section-container" style={{ minHeight: '60vh' }}>
          <h1 className="section-title" style={{ textAlign: 'left' }}>Finalizar Compra</h1>
          
          <div className="checkout-layout">
            
            {/* Tareas Pendientes (Stepper) */}
            <div className="checkout-tasks-section">
              <h3>Progreso de Compra</h3>
              <ul className="tasks-list">
                <li className="task-completed">
                  <IonIcon icon={checkmarkCircleOutline} />
                  <span>Revisar Carrito</span>
                </li>
                <li className="task-current">
                  <IonIcon icon={ellipseOutline} />
                  <span>Datos de Envío</span>
                </li>
                <li className="task-pending">
                  <IonIcon icon={ellipseOutline} />
                  <span>Método de Pago</span>
                </li>
                <li className="task-pending">
                  <IonIcon icon={ellipseOutline} />
                  <span>Confirmar Orden</span>
                </li>
              </ul>
            </div>

            {/* Formulario de Pago */}
            <div className="checkout-form-section">
              <form onSubmit={handlePayment} className="checkout-form">
                <h3>Datos de Envío</h3>
                <div className="form-group">
                  <input type="text" placeholder="Nombre completo" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Correo electrónico" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Dirección (Ej. Av. Siempreviva 742)" required />
                </div>
                <div className="form-group-row">
                  <input type="text" placeholder="Comuna" required />
                  <input type="text" placeholder="Región" required />
                </div>

                <h3 style={{ marginTop: '30px' }}>Método de Pago</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input type="radio" name="payment" value="mercadopago" defaultChecked />
                    <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadopago/logo__small@2x.png" alt="Mercado Pago" className="payment-icon" />
                    Mercado Pago (Tarjetas / Saldo)
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="transfer" />
                    <img src="https://cdn-icons-png.flaticon.com/512/2830/2830284.png" alt="Banco" className="payment-icon" style={{ filter: 'grayscale(100%) opacity(70%)' }} />
                    Transferencia Bancaria
                  </label>
                </div>

                <button type="submit" className="btn-pay-now">
                  Pagar {formatPrice(total)}
                </button>
              </form>
            </div>

            {/* Resumen del Pedido (Sidebar) */}
            <div className="checkout-summary-section">
              <h3>Tu Pedido</h3>
              <div className="checkout-items-list">
                {cartItems.map(item => (
                  <div className="checkout-mini-item" key={item.id}>
                    <span>{item.quantity}x {item.title}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="summary-divider" />
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>{shipping === 0 ? '¡Gratis!' : formatPrice(shipping)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

          </div>
        </div>
        
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Checkout;

