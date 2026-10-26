import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartNotice from './CartNotice';
import { useCart } from '../context/CartContext';
import { authService, useAuth } from '../services/authService';

interface ProductCardProps {
  id: number | string;
  title: string;
  price: string;
  image?: string;
  hasButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image, hasButton = false }) => {
  const { addToCart } = useCart();
  const user = useAuth();
  const [noticeOpen, setNoticeOpen] = useState(false);

  const handleAddToCart = () => {
    if (authService.getUser()?.role === 'admin') return;
    const priceNumber = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    addToCart({ id, title, game: 'TCGStore', price: priceNumber, image });
    setNoticeOpen(true);
  };

  return (
    <>
      <div className="product-card">
        <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="product-image"
              style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '8px' }}
            />
          ) : <div className="product-image-placeholder">IMG Carta/Sobre</div>}
          <div className="product-info"><p className="product-title">{title}</p><p className="product-price">{price}</p></div>
        </Link>
        {hasButton && user?.role !== 'admin' && <button className="add-to-cart-btn" onClick={handleAddToCart}>Agregar al carrito</button>}
      </div>
      <CartNotice open={noticeOpen} onDismiss={() => setNoticeOpen(false)} />
    </>
  );
};
export default ProductCard;
