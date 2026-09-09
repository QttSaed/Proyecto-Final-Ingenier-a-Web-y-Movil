import React from 'react';

interface ProductCardProps {
  title: string;
  price: string;
  hasButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, hasButton = false }) => {
  return (
    <div className="product-card">
      <div className="product-image-placeholder">IMG Carta/Sobre</div>
      <div className="product-info">
        <p className="product-title">{title}</p>
        <p className="product-price">{price}</p>
        {hasButton && (
          <button className="add-to-cart-btn">Agregar al carrito</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
