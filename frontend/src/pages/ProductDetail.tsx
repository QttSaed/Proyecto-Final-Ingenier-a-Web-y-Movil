import React, { useState, useMemo, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonModal } from '@ionic/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartNotice from '../components/CartNotice';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

import { apiService, apiRequest, ApiError, localProducts, Product, money } from '../services/apiService';
import { authService, useAuth } from '../services/authService';
import NotFound from './NotFound';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const user = useAuth();

  const [allProducts, setAllProducts] = useState<Product[]>(localProducts);
  const [foundProduct, setFoundProduct] = useState<Product | undefined>(() => localProducts.find(p => p.id === id));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setFoundProduct(localProducts.find(p => p.id === id));
    apiRequest<Product>(`/products/${encodeURIComponent(id || '')}`).then(product => { if (active) setFoundProduct(product); })
      .catch(error => { if (active && error instanceof ApiError) setFoundProduct(undefined); })
      .finally(() => { if (active) setLoading(false); });
    apiService.products().then(products => { if (active) setAllProducts(products); }).catch(() => {});
    return () => { active = false; };
  }, [id]);

  const recommendations = useMemo(() => {
    return allProducts
      .filter(p => p.id !== id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }, [allProducts, id]);

  if (loading && !foundProduct) return <IonPage><IonContent><p role="status">Cargando producto...</p></IonContent></IonPage>;
  if (!foundProduct) return <NotFound />;
  const product = foundProduct;
  const numericPrice = product.price;
  const { game, category, condition, rarity } = product;
  const stock = product.stock;
  const description = 'Este es un producto oficial de TCGStore. Asegúrate de revisar las promociones disponibles para llevarte la mejor oferta en este artículo.';

  const handleAddToCart = () => {
    if (authService.getUser()?.role === 'admin') return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        game: game,
        price: numericPrice,
        image: product.image
      });
    }
    setNoticeOpen(true);
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
            <Link to="/home">Inicio</Link> / <Link to={`/catalog/${encodeURIComponent(category.toLowerCase())}`}>{category}</Link> / {product.title}
          </p>

          <div className="detail-layout">
            <div
              role="button"
              tabIndex={0}
              aria-label="Ampliar imagen del producto"
              onClick={() => setZoomOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setZoomOpen(true); }}
              className="detail-image"
              style={{
                backgroundImage: product.image ? `url('${product.image}')` : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#fff',
                cursor: 'zoom-in'
              }}
            >
              {!product.image && "IMG Carta/Sobre"}
            </div>

            <div className="detail-info">
              <p className="detail-subtitle">{game} / {category}</p>
              <h1 className="detail-title">{product.title}</h1>
              <p className="detail-price">{money(product.price)}</p>

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
                <button disabled={user?.role === 'admin'} className="btn-add-cart" onClick={handleAddToCart}>
                  {user?.role === 'admin' ? 'Compras solo para clientes' : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="recommendations-section">
            <h2 className="recommendations-title">También te podría interesar</h2>
            <div className="product-grid">
              {recommendations.map(p => (
                <ProductCard key={p.id} id={p.id} title={p.title} price={money(p.price)} image={p.image} hasButton={p.hasButton} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
        <CartNotice open={noticeOpen} onDismiss={() => setNoticeOpen(false)} />
        <IonModal isOpen={zoomOpen} onDidDismiss={() => setZoomOpen(false)}>
          <IonContent className="ion-padding">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', gap: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text-dark)', textAlign: 'center' }}>{product.title}</h3>
              <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '52vh', objectFit: 'contain', borderRadius: '12px', background: '#fff', padding: '12px' }} />
              <button type="button" className="btn-add-cart" style={{ flex: 'none', maxWidth: '240px', width: '100%' }} onClick={() => setZoomOpen(false)}>
                Cerrar vista ampliada
              </button>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;

