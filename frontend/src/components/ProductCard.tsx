import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  hasButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, hasButton = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el Link cambie de página
    // Extraemos el número del string de precio para el mock
    const priceNumber = parseInt(price.replace(/[^0-9]/g, '')) || 9990;
    
    addToCart({
      id: id,
      title: title,
      game: 'TCG Genérico', // placeholder
      price: priceNumber
    });
    alert("¡Producto agregado al carrito!");
  };

  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card">
        <div className="product-image-placeholder">IMG Carta/Sobre</div>
        <div className="product-info">
          <p className="product-title">{title}</p>
          <p className="product-price">{price}</p>
          {hasButton && (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
