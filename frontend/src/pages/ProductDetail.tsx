import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

import appData from '../data.json';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Buscar el producto en TODAS las secciones del JSON
  const allProducts = Object.values(appData.sections).flat();
  const foundProduct = allProducts.find(p => p.id === id);

  // Si no se encuentra, mostramos un genérico para no romper la app
  const product = foundProduct || {
    id: id || '1',
    title: `Producto Genérico #${id}`,
    price: '$9.990',
    image: undefined,
    hasButton: true
  };

  // Convertir el precio string ($9.990) a número para el carrito
  const numericPrice = parseInt(product.price.replace(/[^0-9]/g, '')) || 9990;

  // Campos simulados que no vienen en el JSON
  const game = 'TCGStore';
  const category = 'General';
  const condition = 'Near Mint';
  const rarity = 'Rare';
  const stock = 5;
  const description = 'Este es un producto oficial de TCGStore. Asegúrate de revisar las promociones disponibles para llevarte la mejor oferta en este artículo.';

  // Obtener 5 recomendaciones al azar (excluyendo el actual)
  const recommendations = allProducts
    .filter(p => p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        game: game,
        price: numericPrice,
        image: product.image
      });
    }
    alert(`¡${quantity}x ${product.title} agregado al carrito!`);
    setQuantity(1);
  };

  return (
    <IonPage>
      <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">

        <div className="detail-container">
          <p className="detail-breadcrumb">
            <Link to="/home">Inicio</Link> / <Link to={`/catalog/general`}>{category}</Link> / {product.title}
          </p>

          <div className="detail-layout">
            <div className="detail-image" style={{
              backgroundImage: product.image ? `url('${product.image}')` : 'none',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#fff'
            }}>
              {!product.image && "IMG Carta/Sobre"}
            </div>

            <div className="detail-info">
              <p className="detail-subtitle">{game} / {category}</p>
              <h1 className="detail-title">{product.title}</h1>
              <p className="detail-price">{product.price}</p>

              <div className="detail-badges">
                <span className="badge badge-condition">{condition}</span>
                <span className="badge badge-rarity">{rarity}</span>
                <span className="badge badge-stock">{stock} en stock</span>
              </div>

              <p className="detail-description">{description}</p>

              <div className="detail-actions">
                <div className="detail-quantity">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="recommendations-section">
            <h2 className="recommendations-title">También te podría interesar</h2>
            <div className="product-grid">
              {recommendations.map(p => (
                <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} image={p.image} hasButton={p.hasButton} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;

