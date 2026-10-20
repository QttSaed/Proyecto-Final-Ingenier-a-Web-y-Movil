import React, { useState } from 'react';
import { IonContent, IonHeader, useIonViewWillEnter } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, ellipseOutline, homeOutline } from 'ionicons/icons';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { useAuth } from '../services/authService';
import { apiService, ApiError, Order } from '../services/apiService';
import { localOrderService } from '../services/localOrderService';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const user = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [orderId, setOrderId] = useState('');

  useIonViewWillEnter(() => {
    setIsSuccess(false);
    setOrderId('');
    setError('');
    setIsOffline(false);
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50000 ? 0 : 3500;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    if (!user || user.role !== 'client') {
      setError('Inicia sesión como cliente para finalizar tu compra.');
      return;
    }
    if (!cartItems.length) {
      setError('Agrega productos al carrito antes de finalizar tu compra.');
      return;
    }
    const form = new FormData(e.currentTarget);
    const orderData = {
      items: cartItems.map(item => ({ code: String(item.id), quantity: item.quantity })),
      shippingName: String(form.get('shippingName')).trim(),
      shippingEmail: String(form.get('shippingEmail')).trim(),
      shippingAddress: String(form.get('shippingAddress')).trim(),
      shippingCity: String(form.get('shippingCity')).trim(),
      shippingRegion: String(form.get('shippingRegion')).trim(),
      paymentMethod: String(form.get('payment'))
    };
    setIsSubmitting(true);
    try {
      let order: Order;
      try {
        order = await apiService.createOrder(orderData);
      } catch (requestError) {
        if (requestError instanceof ApiError) throw requestError;
        if (!(requestError instanceof TypeError) && !(requestError instanceof DOMException &&
          ['TimeoutError', 'AbortError', 'NetworkError'].includes(requestError.name))) throw requestError;
        order = {
          id: `LOCAL-${crypto.randomUUID()}`,
          customer: orderData.shippingName,
          total,
          date: new Date().toISOString(),
          status: 'Pendiente',
          items: cartItems.map(item => ({ title: item.title, quantity: item.quantity, unitPrice: item.price }))
        };
        localOrderService.save(user.email, order);
        setIsOffline(true);
      }
      setOrderId(order.orderNumber || order.id);
      setFinalTotal(order.total);
      clearCart();
      setIsSuccess(true);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'No se pudo crear la orden. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">
          <div className="checkout-success-container">
            <div className="success-card">
              <h2>🎉 ¡Orden Generada con Éxito!</h2>
              <p>Tu orden por <strong>{formatPrice(finalTotal)}</strong> ha sido registrada correctamente.</p>
              <p>{isOffline ? 'Orden guardada en este dispositivo para la demostración sin conexión.' : 'Puedes revisar los detalles y el estado de tu pedido en Mi Cuenta.'}</p>
              <p className="order-number-display">Tu número de pedido es: <strong>{orderId}</strong></p>
              <button className="btn-back-home" onClick={() => {
                setIsSuccess(false);
                navigate('/home');
              }}>
                <IonIcon icon={homeOutline} style={{ verticalAlign: "middle", marginRight: "8px" }} />Volver a la Tienda</button>
            </div>
          </div>
          <Footer />
        </IonContent>
      </>
    );
  }

  return (
    <>
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
                  <input type="text" name="shippingName" placeholder="Nombre completo" required />
                </div>
                <div className="form-group">
                  <input type="email" name="shippingEmail" placeholder="Correo electrónico" required />
                </div>
                <div className="form-group">
                  <input type="text" name="shippingAddress" placeholder="Dirección (Ej. Av. Siempreviva 742)" required />
                </div>
                <div className="form-group-row">
                  <input type="text" name="shippingCity" placeholder="Comuna" required />
                  <input type="text" name="shippingRegion" placeholder="Región" required />
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

                {error && <p role="alert">{error}</p>}
                <button type="submit" className="btn-pay-now" disabled={isSubmitting || !cartItems.length}>
                  {isSubmitting ? 'Procesando…' : `Pagar ${formatPrice(total)}`}
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
    </>
  );
};

export default Checkout;


