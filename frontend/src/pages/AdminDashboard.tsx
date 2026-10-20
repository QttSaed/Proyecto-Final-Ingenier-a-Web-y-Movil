import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonIcon } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService, Category, localProducts, money, Order, Product, Stats } from '../services/apiService';
import { ORDER_STATUSES, OrderStatus } from '../services/orderService';
import { homeOutline, statsChartOutline, cubeOutline, receiptOutline, cashOutline, bagHandleOutline, albumsOutline, peopleOutline, pencilOutline, trashOutline, eyeOutline, searchOutline, addOutline, closeOutline } from 'ionicons/icons';
import './AdminDashboard.css';

const COLOR_PRESETS = ['No aplica', 'Sin especificar', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Negro', 'Blanco', 'Incoloro', 'Morado', 'Turquesa'];
const emptyProduct = (): Omit<Product, 'id'> => ({ title: '', category: '', game: '', edition: '', rarity: 'Common', color: '', cost: 0, cardType: '', condition: 'Near Mint', price: 0, stock: 0, image: '' });
const initialStats: Stats = { totalSales: 0, totalOrders: 0, totalProducts: localProducts.length, totalStock: localProducts.reduce((sum, p) => sum + p.stock, 0), totalClients: 0, recentOrders: [] };
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'No se pudo guardar el cambio';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.pathname.endsWith('/inventario') ? 'inventory' : location.pathname.endsWith('/ordenes') ? 'orders' : 'dashboard';
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [customColor, setCustomColor] = useState(false);
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const detailRef = useRef<HTMLDialogElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let active = true;
    Promise.allSettled([apiService.products(), apiService.orders(), apiService.categories(), apiService.stats()]).then(results => {
      if (!active) return;
      const [p, o, c, s] = results;
      if (p.status === 'fulfilled') setProducts(p.value);
      if (o.status === 'fulfilled') setOrders(o.value);
      if (c.status === 'fulfilled') setCategories(c.value);
      if (s.status === 'fulfilled') setStats(s.value);
      const failed = results.find(result => result.status === 'rejected');
      if (failed?.status === 'rejected') setError(errorMessage(failed.reason));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (modal) dialogRef.current?.showModal(); else dialogRef.current?.close(); }, [modal]);
  useEffect(() => { if (detail) detailRef.current?.showModal(); else detailRef.current?.close(); }, [detail]);
  const colorOptions = [...new Set([...COLOR_PRESETS, ...products.map(p => p.color).filter(Boolean)])];
  const filteredProducts = products.filter(product => `${product.title} ${product.category}`.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')));
  const refreshStats = async () => { try { setStats(await apiService.stats()); } catch (error) { setError(errorMessage(error)); } };
  const openForm = (product?: Product) => {
    setEditing(product || null); setForm(product ? { ...product } : { ...emptyProduct(), category: categories[0]?.name || '' });
    setCustomColor(Boolean(product?.color && !COLOR_PRESETS.includes(product.color)));
    setError(''); setMessage(''); setModal(true);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const saved = await apiService.saveProduct(editing ? { title: form.title, price: form.price, stock: form.stock, condition: form.condition } : form, editing?.id);
      setProducts(previous => editing ? previous.map(p => p.id === saved.id ? saved : p) : [...previous, saved]);
      setModal(false); setMessage(editing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'); await refreshStats();
    } catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
  };
  const remove = async (product: Product) => {
    if (!window.confirm(`¿Eliminar “${product.title}” del inventario?`)) return;
    setBusy(true); setError(''); setMessage('');
    try { await apiService.deleteProduct(product.id); setProducts(previous => previous.filter(p => p.id !== product.id)); setMessage('Producto eliminado correctamente.'); await refreshStats(); }
    catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
  };
  const changeStatus = async (id: string, status: OrderStatus) => {
    setBusy(true); setError(''); setMessage('');
    try { const saved = await apiService.setOrderStatus(id, status); setOrders(previous => previous.map(order => order.id === id ? saved : order)); setMessage('Estado del pedido actualizado.'); await refreshStats(); }
    catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
  };
  const statusClass = (status: string) => `admin-status ${status.toLowerCase()}`;
  const orderTable = (rows: Order[], editable = false) => <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>
    {rows.map(order => <tr key={order.id}><td className="admin-order-id">{order.id}</td><td>{order.customer}</td><td>{new Date(order.date).toLocaleDateString('es-CL')}</td><td className="admin-amount">{money(order.total)}</td><td>{editable ? <select className={statusClass(order.status)} aria-label={`Estado del pedido ${order.id}`} disabled={busy} value={order.status} onChange={event => void changeStatus(order.id, event.target.value as OrderStatus)}>{ORDER_STATUSES.map(status => <option key={status}>{status}</option>)}</select> : <span className={statusClass(order.status)}>{order.status}</span>}</td><td><button className="admin-action admin-action-detail" onClick={() => setDetail(order)}><IonIcon icon={eyeOutline} aria-hidden="true" />Ver detalle</button></td></tr>)}
    {!rows.length && <tr><td className="admin-empty" colSpan={6}>No hay pedidos registrados.</td></tr>}
  </tbody></table></div>;
  return <IonContent fullscreen className="admin-content">
    <header className="admin-header"><div className="admin-logo">TCGStore <span className="admin-badge">ADMIN</span></div><button className="admin-logout-btn" onClick={() => navigate('/home')}><IonIcon icon={homeOutline} aria-hidden="true" />Volver al inicio</button></header>
    <div className="admin-container"><nav className="admin-sidebar" aria-label="Administración"><p className="admin-nav-label">ADMINISTRACIÓN</p><ul className="admin-menu">
      {([{ key: 'dashboard', path: '/admin', label: 'Resumen', icon: statsChartOutline }, { key: 'inventory', path: '/admin/inventario', label: 'Inventario', icon: cubeOutline }, { key: 'orders', path: '/admin/ordenes', label: 'Órdenes', icon: receiptOutline }]).map(({ key, path, label, icon }) => <li key={key} className={tab === key ? 'active' : ''}><button aria-current={tab === key ? 'page' : undefined} onClick={() => navigate(path)}><IonIcon icon={icon} aria-hidden="true" />{label}</button></li>)}
    </ul><div className="admin-sidebar-note">TCGStore<span>Panel de administración</span></div></nav><main className="admin-main">
      {loading && <p role="status" className="admin-notice">Cargando información...</p>}
      {!sessionStorage.getItem('tcg.token') && <p className="admin-notice">Vista local. Inicia sesión con el backend disponible para administrar la base de datos.</p>}
      {stats.offline && <p className="admin-notice">Backend sin conexión. Se muestra el catálogo local; las ventas, los pedidos y los clientes no están disponibles.</p>}
      {error && !modal && <p role="alert" className="admin-error">{error}</p>}
      {message && <p role="status" className="admin-success">{message}</p>}
      {tab === 'dashboard' && <div className="admin-view"><div className="admin-header-title"><p className="admin-eyebrow">TU TIENDA, EN UN VISTAZO</p><h1>Resumen de la tienda</h1><p>Ventas, inventario y actividad reciente.</p></div><div className="dashboard-stats-grid">
        {[{ label: 'Ventas totales', value: money(stats.totalSales), icon: cashOutline, tone: 'emerald' }, { label: 'Pedidos', value: stats.totalOrders.toLocaleString('es-CL'), icon: bagHandleOutline, tone: 'blue' }, { label: 'Productos activos', value: stats.totalProducts.toLocaleString('es-CL'), icon: albumsOutline, tone: 'purple' }, { label: 'Clientes', value: stats.totalClients.toLocaleString('es-CL'), icon: peopleOutline, tone: 'amber' }].map(({ label, value, icon, tone }) => <article className="stat-card" key={label}><div className={`stat-icon ${tone}`}><IonIcon icon={icon} aria-hidden="true" /></div><div className="stat-info"><h2>{label}</h2><p>{value}</p></div>{tone === 'purple' && <span className="admin-stock-summary">{stats.totalStock.toLocaleString('es-CL')} unidades en almacén</span>}</article>)}
      </div><section className="admin-section"><div className="admin-section-heading"><div><h2>Últimos pedidos</h2><p>Revisa las compras más recientes de tu tienda.</p></div><button className="admin-action admin-action-detail" onClick={() => navigate('/admin/ordenes')}>Ver todos<IonIcon icon={receiptOutline} aria-hidden="true" /></button></div>{orderTable(stats.recentOrders)}</section></div>}
      {tab === 'inventory' && <div className="admin-view"><div className="admin-header-title flex-between"><div><p className="admin-eyebrow">PRODUCTOS</p><h1>Catálogo e inventario</h1><p>Administra tus cartas y mantén el stock al día.</p></div><button className="btn-admin-submit" disabled={loading || busy || !categories.length} onClick={() => openForm()}><IonIcon icon={addOutline} aria-hidden="true" />Nuevo Producto</button></div><div className="admin-toolbar"><label className="admin-search"><IonIcon icon={searchOutline} aria-hidden="true" /><input type="search" aria-label="Buscar productos por título o categoría" placeholder="Buscar por título o categoría..." value={search} onChange={event => setSearch(event.target.value)} /></label><span>{filteredProducts.length.toLocaleString('es-CL')} productos</span></div><div className="admin-table-container"><table className="admin-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Condición</th><th>Acciones</th></tr></thead><tbody>
        {filteredProducts.map(product => <tr key={product.id}><td><div className="admin-product-cell"><div className="admin-thumbnail"><IonIcon icon={albumsOutline} aria-hidden="true" />{product.image && <img key={product.image} src={product.image} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} />}</div><span>{product.title}</span></div></td><td>{product.category}</td><td className="admin-amount">{money(product.price)}</td><td><span className={`stock-badge ${product.stock > 10 ? 'stock-ok' : product.stock > 0 ? 'stock-low' : 'stock-out'}`}>{product.stock > 0 ? `${product.stock} u.` : 'Agotado'}</span>{product.stock > 0 && product.stock <= 10 && <small className="admin-low-stock">Bajo stock</small>}</td><td><span className="admin-condition">{product.condition}</span></td><td><div className="admin-actions"><button disabled={busy} className="admin-action admin-action-edit" onClick={() => openForm(product)}><IonIcon icon={pencilOutline} aria-hidden="true" />Editar</button><button disabled={busy} className="admin-action admin-action-delete" onClick={() => void remove(product)}><IonIcon icon={trashOutline} aria-hidden="true" />Eliminar</button></div></td></tr>)}
        {!filteredProducts.length && <tr><td className="admin-empty" colSpan={6}>{search.trim() ? 'No hay productos que coincidan con tu búsqueda.' : 'No hay productos en inventario.'}</td></tr>}
      </tbody></table></div></div>}
      {tab === 'orders' && <div className="admin-view"><div className="admin-header-title"><p className="admin-eyebrow">VENTAS</p><h1>Gestión de Órdenes</h1><p>Consulta cada pedido y actualiza su estado.</p></div>{orderTable(orders, true)}</div>}
    </main></div>
    <dialog ref={detailRef} className="admin-dialog admin-order-dialog" aria-labelledby="admin-detail-title" onCancel={() => setDetail(null)} onClose={() => setDetail(null)}>
      {detail && <><div className="admin-dialog-heading flex-between"><div><p className="admin-eyebrow">DETALLE DEL PEDIDO</p><h2 id="admin-detail-title">Pedido {detail.id}</h2></div><button className="admin-close" type="button" aria-label="Cerrar detalle" onClick={() => setDetail(null)}><IonIcon icon={closeOutline} aria-hidden="true" /></button></div><div className="admin-order-meta"><div><strong>{detail.customer}</strong><p>{new Date(detail.date).toLocaleDateString('es-CL')}</p></div><span className={statusClass(detail.status)}>{detail.status}</span></div><div className="admin-table-container"><table className="admin-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead><tbody>{detail.items.map((item, index) => <tr key={index}><td>{item.title}</td><td>{item.quantity}</td><td>{money(item.unitPrice)}</td><td className="admin-amount">{money(item.quantity * item.unitPrice)}</td></tr>)}</tbody></table></div><div className="admin-order-total"><span>Total del pedido</span><strong>{money(detail.total)}</strong></div></>}
    </dialog>
    <dialog ref={dialogRef} className="admin-dialog admin-product-dialog" aria-labelledby="admin-product-title" onClose={() => setModal(false)} onCancel={event => { if (busy) event.preventDefault(); else setModal(false); }}>
      <form className="admin-form" onSubmit={save}><div className="admin-dialog-heading flex-between"><h2 id="admin-product-title">{editing ? 'Editar producto' : 'Nuevo producto'}</h2><button type="button" disabled={busy} onClick={() => setModal(false)} className="admin-close" aria-label="Cerrar formulario"><IonIcon icon={closeOutline} aria-hidden="true" /></button></div>
        {error && <p role="alert" className="admin-error">{error}</p>}
        <div className="admin-form-grid">
          <label>Título<input autoFocus required placeholder="Ej: Charizard ex, Black Lotus, Fundas..." maxLength={10000} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
          {!editing && <><label>Categoría<select required value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{categories.map(category => <option key={category.slug} value={category.name}>{category.name}</option>)}</select></label>
            <label>Juego<select required value={form.game} onChange={event => setForm({ ...form, game: event.target.value })}><option value="" disabled>Selecciona un juego...</option>{['Pokemon', 'Magic', 'One Piece', 'Digimon', 'Gundam', 'Riftbound', 'Multijuego', 'Otro'].map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Edición<input required placeholder="Ej: Obsidian Flames, Modern Horizons 3, Sin especificar..." value={form.edition} onChange={event => setForm({ ...form, edition: event.target.value })} /></label>
            <label>Color{customColor ? <span className="admin-custom-color-row">
              <input autoFocus required placeholder="Escribe el color (ej: Fuego, Dorado)..." value={form.color} onChange={event => setForm({ ...form, color: event.target.value })} />
              <button type="button" className="admin-switch-btn" onClick={() => { setCustomColor(false); setForm({ ...form, color: '' }); }}>Elegir de la lista</button>
            </span> : <select required value={form.color} onChange={event => {
              if (event.target.value === '__custom__') {
                setCustomColor(true); setForm({ ...form, color: '' });
              } else setForm({ ...form, color: event.target.value });
            }}>
              <option value="" disabled>Selecciona un color...</option>
              {colorOptions.map(color => <option key={color} value={color}>{color}</option>)}
              <option value="__custom__">Escribir otro color...</option>
            </select>}
            </label>
            {([['cardType', 'Tipo de carta', 'Ej: Pokemon Básico, Criatura, Entrenador, Deck Box...'], ['image', 'Imagen (URL o ruta)', 'Ej: https://... o /assets/secciones pagina/...']] as const).map(([key, label, placeholder]) => <label key={key}>{label}<input required placeholder={placeholder} value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} /></label>)}
            <label>Rareza<select value={form.rarity} onChange={event => setForm({ ...form, rarity: event.target.value })}>{['Common', 'Uncommon', 'Rare', 'Ultra Rare'].map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Costo<input placeholder="Ej: 0, 1, 2..." type="number" required min="0" step="1" value={form.cost} onChange={event => setForm({ ...form, cost: Number(event.target.value) })} /></label>
          </>}
          <label>Condición<select value={form.condition} onChange={event => setForm({ ...form, condition: event.target.value })}>{['Near Mint', 'Lightly Played', 'Moderately Played'].map(value => <option key={value}>{value}</option>)}</select></label>
          {(['price', 'stock'] as const).map(key => <label key={key}>{key === 'price' ? 'Precio (CLP)' : 'Stock'}<input placeholder={key === 'price' ? 'Ej: 15000 (sin puntos)...' : 'Ej: 10 (unidades)...'} type="number" required min="0" max="2147483647" step="1" value={form[key]} onChange={event => setForm({ ...form, [key]: Number(event.target.value) })} /></label>)}
        </div><button className="btn-admin-submit" type="submit" disabled={busy}>{busy ? 'Guardando...' : 'Guardar producto'}</button>
      </form>
    </dialog>
  </IonContent>;
};
export default AdminDashboard;
