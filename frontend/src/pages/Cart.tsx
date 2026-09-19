import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartOutline } from 'ionicons/icons';
import { IonContent, IonPage, IonHeader, IonIcon } from '@ionic/react';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Cart.css';


import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 3500; // Envío gratis sobre 50k
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <IonPage>
      <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">

        <div className="section-container" style={{ minHeight: '60vh', textAlign: 'left' }}>
          <h1 className="section-title" style={{ textAlign: 'left' }}>Tu Carrito de Compras</h1>
          
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <IonIcon icon={cartOutline} className="empty-cart-icon" />
              <h2>Tu carrito está vacío</h2>
              <p>¡Explora nuestro catálogo y encuentra tus cartas favoritas!</p>
              <Link to="/home" className="btn-empty-cart">
                Ir a comprar
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              
              {/* Lista de Productos */}
              <div className="cart-items-section">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-info">
                      <div className="cart-item-image" style={{ 
                        backgroundImage: item.image ? `url('${item.image}')` : 'none',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#fff'
                      }}>
                        {!item.image && "IMG"}
                      </div>
                      <div className="cart-item-details">
                        <p>{item.game}</p>
                        <h3>{item.title}</h3>
                        <p>Precio unitario: {formatPrice(item.price)}</p>
                        <button className="cart-item-remove" onClick={() => removeItem(item.id)}>Eliminar</button>
                      </div>
                    </div>
                    
                    <div className="cart-quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>

                    <div className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de Compra */}
              <div className="cart-summary-section">
                <h3 className="summary-title">Resumen del Pedido</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Envío</span>
                  <span>{shipping === 0 ? '¡Gratis!' : formatPrice(shipping)}</span>
                </div>
                
                {shipping > 0 && (
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-5px' }}>
                    * Envío gratis en compras sobre $50.000
                  </p>
                )}

                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button className="btn-checkout" onClick={handleCheckout}>
                    Proceder al Pago
                  </button>
              </div>

            </div>
          )}
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Cart;

