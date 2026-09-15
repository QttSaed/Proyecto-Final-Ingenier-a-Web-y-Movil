import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

// Base de datos falsa de productos (simula lo que vendría de un backend)
const productDatabase: Record<number, { title: string; game: string; category: string; price: number; condition: string; rarity: string; stock: number; description: string }> = {
  1: { title: 'Charizard VMAX - 020/189', game: 'Pokémon TCG', category: 'Singles', price: 25000, condition: 'Near Mint', rarity: 'Ultra Rare', stock: 3, description: 'Carta en condición Near Mint de la expansión Darkness Ablaze. Charizard VMAX es una de las cartas más codiciadas por coleccionistas.' },
  2: { title: 'Pikachu V - 043/185', game: 'Pokémon TCG', category: 'Singles', price: 8990, condition: 'Near Mint', rarity: 'Rare', stock: 7, description: 'Pikachu en su versión V con arte alternativo. Perfecto para coleccionistas y jugadores competitivos.' },
  3: { title: 'Booster Box OP-05', game: 'One Piece', category: 'Sellado', price: 120000, condition: 'Sellado', rarity: 'N/A', stock: 5, description: 'Caja completa de sobres de la expansión Awakening of the New Era. Contiene 24 sobres con 12 cartas cada uno.' },
  4: { title: 'Monkey D. Luffy - OP05-119', game: 'One Piece', category: 'Singles', price: 15000, condition: 'Near Mint', rarity: 'Secret Rare', stock: 2, description: 'Luffy en su versión Secret Rare con arte especial. Una de las cartas más buscadas de la expansión.' },
  5: { title: 'Black Lotus (Proxy)', game: 'Magic The Gathering', category: 'Singles', price: 5990, condition: 'Mint', rarity: 'Mythic', stock: 10, description: 'Versión proxy de alta calidad de la legendaria Black Lotus. Ideal para juego casual y colección.' },
  6: { title: 'Sol Ring - Commander Masters', game: 'Magic The Gathering', category: 'Singles', price: 3990, condition: 'Near Mint', rarity: 'Uncommon', stock: 15, description: 'El artefacto más icónico de Commander. Esencial en cualquier mazo del formato.' },
  7: { title: 'Riftbound Starter Deck', game: 'Riftbound', category: 'Sellado', price: 19990, condition: 'Sellado', rarity: 'N/A', stock: 8, description: 'Mazo inicial de Riftbound con 60 cartas listas para jugar. Incluye carta exclusiva foil.' },
  8: { title: 'Omnimon - BT5-086', game: 'Digimon', category: 'Singles', price: 12000, condition: 'Near Mint', rarity: 'Secret Rare', stock: 4, description: 'Omnimon en su versión alternativa de arte completo. Carta clave del meta competitivo.' },
  9: { title: 'Gundam Aerial - MS-001', game: 'Gundam', category: 'Singles', price: 7500, condition: 'Near Mint', rarity: 'Rare', stock: 6, description: 'Carta del Gundam Aerial con ilustración exclusiva de la serie Witch from Mercury.' },
  10: { title: 'Lote 100 Cartas Pokémon', game: 'Pokémon TCG', category: 'Lotes', price: 9990, condition: 'Variada', rarity: 'Variada', stock: 20, description: 'Lote de 100 cartas de Pokémon variadas. Incluye garantizadas 5 raras y 1 holográfica como mínimo.' },
  11: { title: 'Mewtwo GX - SM196', game: 'Pokémon TCG', category: 'Singles', price: 18000, condition: 'Lightly Played', rarity: 'Ultra Rare', stock: 1, description: 'Mewtwo en versión GX promocional con arte extendido. Ligeramente jugada pero en excelente estado.' },
  12: { title: 'Sobre Suelto Scarlet & Violet', game: 'Pokémon TCG', category: 'Sellado', price: 3500, condition: 'Sellado', rarity: 'N/A', stock: 50, description: 'Sobre individual de la expansión Scarlet & Violet. Contiene 10 cartas con posibilidad de obtener cartas ultra raras.' },
};

// Función para obtener producto por ID (si no existe, genera uno genérico)
function getProduct(id: number) {
  if (productDatabase[id]) return { id, ...productDatabase[id] };
  return {
    id,
    title: `Producto #${id}`,
    game: 'TCG Genérico',
    category: 'General',
    price: 9990,
    condition: 'Near Mint',
    rarity: 'Rare',
    stock: 5,
    description: 'Producto disponible en nuestra tienda. Consulta con nosotros para más detalles sobre esta carta o artículo.',
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = getProduct(Number(id) || 1);

  // Recomendaciones: otros productos distintos al actual
  const recIds = Object.keys(productDatabase)
    .map(Number)
    .filter(pid => pid !== product.id)
    .slice(0, 5);

  const recommendations = recIds.map(pid => {
    const p = getProduct(pid);
    return { id: p.id, title: p.title, price: `$${p.price.toLocaleString('es-CL')}`, hasButton: true };
  });

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        game: product.game,
        price: product.price,
      });
    }
    alert(`¡${quantity}x ${product.title} agregado al carrito!`);
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="main-content">
        <TopBar />
        <Header />

        <div className="detail-container">
          <p className="detail-breadcrumb">
            <Link to="/home">Inicio</Link> / <Link to={`/catalog/${product.game.toLowerCase().replace(/ /g, '')}`}>{product.game}</Link> / {product.title}
          </p>

          <div className="detail-layout">
            <div className="detail-image">
              IMG Carta/Sobre
            </div>

            <div className="detail-info">
              <p className="detail-subtitle">{product.game} / {product.category}</p>
              <h1 className="detail-title">{product.title}</h1>
              <p className="detail-price">{formatPrice(product.price)}</p>

              <div className="detail-badges">
                <span className="badge badge-condition">{product.condition}</span>
                <span className="badge badge-rarity">{product.rarity}</span>
                <span className="badge badge-stock">{product.stock} en stock</span>
              </div>

              <p className="detail-description">{product.description}</p>

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
                <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} hasButton={p.hasButton} />
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
