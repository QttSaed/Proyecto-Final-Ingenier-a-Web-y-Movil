import React, { useEffect, useRef, useState } from 'react';
import { IonContent } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService, Category, localProducts, money, Order, Product, Stats } from '../services/apiService';
import { ORDER_STATUSES, OrderStatus } from '../services/orderService';
import './AdminDashboard.css';

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
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState<Order | null>(null);
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
  const refreshStats = async () => { try { setStats(await apiService.stats()); } catch (error) { setError(errorMessage(error)); } };
  const openForm = (product?: Product) => {
    setEditing(product || null); setForm(product ? { ...product } : { ...emptyProduct(), category: categories[0]?.name || '' });
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
  const orderTable = (rows: Order[], editable = false) => <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>
    {rows.map(order => <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{new Date(order.date).toLocaleDateString('es-CL')}</td><td>{money(order.total)}</td><td>{editable ? <select aria-label={`Estado del pedido ${order.id}`} disabled={busy} value={order.status} onChange={event => void changeStatus(order.id, event.target.value as OrderStatus)}>{ORDER_STATUSES.map(status => <option key={status}>{status}</option>)}</select> : order.status}</td><td><button className="btn-small-outline" onClick={() => setDetail(order)}>Ver detalle</button></td></tr>)}
    {!rows.length && <tr><td colSpan={6}>No hay pedidos registrados.</td></tr>}
  </tbody></table></div>;
  return <IonContent fullscreen className="admin-content">
    <header className="admin-header"><div className="admin-logo">TCGStore <span className="admin-badge">ADMIN</span></div><button className="admin-logout-btn" onClick={() => navigate('/home')}>Volver al inicio</button></header>
    <div className="admin-container"><nav className="admin-sidebar" aria-label="Administración"><ul className="admin-menu">
      {[['dashboard', '/admin', 'Resumen'], ['inventory', '/admin/inventario', 'Inventario'], ['orders', '/admin/ordenes', 'Órdenes']].map(([key, path, label]) => <li key={key} className={tab === key ? 'active' : ''}><button onClick={() => navigate(path)}>{label}</button></li>)}
    </ul></nav><main className="admin-main">
      {loading && <p role="status">Cargando información...</p>}
      {!localStorage.getItem('tcg.token') && <p className="admin-notice">Vista local. Inicia sesión con el backend disponible para administrar la base de datos.</p>}
      {stats.offline && <p className="admin-notice">Backend sin conexión. Se muestra el catálogo local; las ventas, los pedidos y los clientes no están disponibles.</p>}
      {error && !modal && <p role="alert" className="admin-error">{error}</p>}
      {message && <p role="status" className="admin-success">{message}</p>}
      {tab === 'dashboard' && <div className="admin-view"><h2>Resumen de la tienda</h2><div className="dashboard-stats-grid">
        {[['Ventas totales', money(stats.totalSales)], ['Pedidos', stats.totalOrders], ['Productos activos', stats.totalProducts], ['Clientes', stats.totalClients]].map(([label, value]) => <div className="stat-card" key={label}><div className="stat-info"><h3>{label}</h3><p>{value}</p></div></div>)}
      </div><p>Stock total: {stats.totalStock} unidades</p><h3>Últimos pedidos</h3>{orderTable(stats.recentOrders)}</div>}
      {tab === 'inventory' && <div className="admin-view"><div className="admin-header-title flex-between"><h2>Catálogo e inventario</h2><button className="btn-admin-submit" disabled={loading || busy || !categories.length} onClick={() => openForm()}>Nuevo Producto</button></div><div className="admin-table-container"><table className="admin-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Condición</th><th>Acciones</th></tr></thead><tbody>
        {products.map(product => <tr key={product.id}><td><div className="admin-product-cell"><img src={product.image} alt="" /><span>{product.title}</span></div></td><td>{product.category}</td><td>{money(product.price)}</td><td>{product.stock}</td><td>{product.condition}</td><td><div className="admin-actions"><button disabled={busy} className="btn-small-outline" onClick={() => openForm(product)}>Editar</button><button disabled={busy} className="btn-small-outline" onClick={() => void remove(product)}>Eliminar</button></div></td></tr>)}
        {!products.length && <tr><td colSpan={6}>No hay productos en inventario.</td></tr>}
      </tbody></table></div></div>}
      {tab === 'orders' && <div className="admin-view"><h2>Gestión de Órdenes</h2>{orderTable(orders, true)}</div>}
      {detail && <section className="dashboard-panel" aria-label="Detalle del pedido"><button className="btn-small-outline" onClick={() => setDetail(null)}>Cerrar detalle</button><h3>Pedido {detail.id}</h3><ul>{detail.items.map((item, index) => <li key={index}>{item.title} · {item.quantity} × {money(item.unitPrice)}</li>)}</ul><strong>Total: {money(detail.total)}</strong></section>}
    </main></div>
    <dialog ref={dialogRef} className="admin-product-dialog" onCancel={event => { if (busy) event.preventDefault(); else setModal(false); }}>
      <form className="admin-form" onSubmit={save}><div className="flex-between"><h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2><button type="button" disabled={busy} onClick={() => setModal(false)} aria-label="Cerrar formulario">&times;</button></div>
        {error && <p role="alert" className="admin-error">{error}</p>}
        <div className="admin-form-grid">
          <label>Título<input autoFocus required maxLength={10000} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
          {!editing && <><label>Categoría<select required value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{categories.map(category => <option key={category.slug} value={category.name}>{category.name}</option>)}</select></label>
            {([['game', 'Juego'], ['edition', 'Edición'], ['color', 'Color'], ['cardType', 'Tipo de carta'], ['image', 'Imagen (URL o ruta)']] as const).map(([key, label]) => <label key={key}>{label}<input required value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} /></label>)}
            <label>Rareza<select value={form.rarity} onChange={event => setForm({ ...form, rarity: event.target.value })}>{['Common', 'Uncommon', 'Rare', 'Ultra Rare'].map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Costo<input type="number" required min="0" step="1" value={form.cost} onChange={event => setForm({ ...form, cost: Number(event.target.value) })} /></label>
          </>}
          <label>Condición<select value={form.condition} onChange={event => setForm({ ...form, condition: event.target.value })}>{['Near Mint', 'Lightly Played', 'Moderately Played'].map(value => <option key={value}>{value}</option>)}</select></label>
          {(['price', 'stock'] as const).map(key => <label key={key}>{key === 'price' ? 'Precio (CLP)' : 'Stock'}<input type="number" required min="0" max="2147483647" step="1" value={form[key]} onChange={event => setForm({ ...form, [key]: Number(event.target.value) })} /></label>)}
        </div><button className="btn-admin-submit" type="submit" disabled={busy}>{busy ? 'Guardando...' : 'Guardar producto'}</button>
      </form>
    </dialog>
  </IonContent>;
};
export default AdminDashboard;
