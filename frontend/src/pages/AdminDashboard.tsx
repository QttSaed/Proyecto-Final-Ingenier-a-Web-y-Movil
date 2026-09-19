import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  addOutline, cubeOutline, 
  homeOutline, cartOutline, alertCircleOutline, 
  trendingUpOutline, createOutline, trashOutline 
} from 'ionicons/icons';
import './AdminDashboard.css';
import catalogData from '../data.json';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthorized] = useState(localStorage.getItem('role') === 'admin');

  if (!isAuthorized) {
    return <Navigate to="/home" replace />;
  }

  const location = window.location.pathname;
  
  let initialTab: 'dashboard' | 'inventory' | 'add-product' | 'orders' = 'dashboard';
  if (location.includes('/inventario')) initialTab = 'inventory';
  if (location.includes('/ordenes')) initialTab = 'orders';

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'add-product' | 'orders'>(initialTab);
  const [isSuccess, setIsSuccess] = useState(false);

  const inventoryProducts = (catalogData as any).sections?.Pokemon ? (catalogData as any).sections.Pokemon.slice(0, 6) : [];

  const [orders, setOrders] = useState([
    { id: 'ORD-1023', client: 'Juan Pérez', total: 45000, date: '18 Sep 2026', status: 'Pendiente' },
    { id: 'ORD-1022', client: 'María Gómez', total: 12500, date: '17 Sep 2026', status: 'Pagado' },
    { id: 'ORD-1021', client: 'Carlos Ruiz', total: 85000, date: '16 Sep 2026', status: 'Enviado' },
    { id: 'ORD-1020', client: 'Ana Silva', total: 32000, date: '15 Sep 2026', status: 'Enviado' },
  ]);

  const handleExitDashboard = () => {
    navigate('/home');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('inventory');
    }, 2000);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="admin-content">
        
        {/* Admin Header */}
        <header className="admin-header">
          <div className="admin-logo">TCGStore <span className="admin-badge">ADMIN</span></div>
          <div className="admin-nav">
            <span className="admin-user-greeting">Hola, Administrador</span>
              <button className="admin-logout-btn" onClick={handleExitDashboard}>
                <IonIcon icon={homeOutline} /> Volver al inicio
              </button>
          </div>
        </header>

        <div className="admin-container">
          
          {/* Sidebar */}
          <div className="admin-sidebar">
            <ul className="admin-menu">
              <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                <IonIcon icon={homeOutline} /> Resumen General
              </li>
              <li className={activeTab === 'inventory' || activeTab === 'add-product' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>
                <IonIcon icon={cubeOutline} /> Catálogo e Inventario
              </li>
              <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                <IonIcon icon={cartOutline} /> Gestión de Órdenes
              </li>
            </ul>
          </div>

          {/* Main Content Area */}
          <div className="admin-main">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="admin-view fade-in">
                <div className="admin-header-title">
                  <h2>Dashboard</h2>
                  <p>Resumen del rendimiento de la tienda.</p>
                </div>
                
                <div className="dashboard-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' }}>
                      <IonIcon icon={trendingUpOutline} />
                    </div>
                    <div className="stat-info">
                      <h3>Ventas del Mes</h3>
                      <p>$1.245.000</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>
                      <IonIcon icon={cartOutline} />
                    </div>
                    <div className="stat-info">
                      <h3>Órdenes Pendientes</h3>
                      <p>14</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}>
                      <IonIcon icon={alertCircleOutline} />
                    </div>
                    <div className="stat-info">
                      <h3>Alertas de Stock</h3>
                      <p>5 agotados</p>
                    </div>
                  </div>
                </div>

                {/* NUEVO: Sección de Gráficos y Análisis */}
                <div className="dashboard-charts-row">
                  {/* Gráfico de Barras Simulado */}
                  <div className="dashboard-panel chart-panel">
                    <div className="flex-between">
                      <h3>Análisis de Ventas y Visitas</h3>
                      <div className="chart-legend">
                        <span className="legend-dot ventas"></span> Ventas
                        <span className="legend-dot visitas"></span> Visitas
                      </div>
                    </div>
                    <div className="css-chart-container">
                      <div className="chart-y-axis">
                        <span>$300k</span><span>$200k</span><span>$100k</span><span>$0</span>
                      </div>
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                      <div className="chart-bars">
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar" style={{height: '40%'}} title="$120.000"></div>
                            <div className="bar visitas-bar" style={{height: '60%'}}></div>
                          </div>
                          <span>Lun</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar" style={{height: '65%'}} title="$195.000"></div>
                            <div className="bar visitas-bar" style={{height: '80%'}}></div>
                          </div>
                          <span>Mar</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar" style={{height: '30%'}} title="$90.000"></div>
                            <div className="bar visitas-bar" style={{height: '50%'}}></div>
                          </div>
                          <span>Mie</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar" style={{height: '80%'}} title="$240.000"></div>
                            <div className="bar visitas-bar" style={{height: '75%'}}></div>
                          </div>
                          <span>Jue</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar" style={{height: '95%'}} title="$285.000"></div>
                            <div className="bar visitas-bar" style={{height: '90%'}}></div>
                          </div>
                          <span>Vie</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar highlight" style={{height: '100%'}} title="$300.000"></div>
                            <div className="bar visitas-bar" style={{height: '100%'}}></div>
                          </div>
                          <span style={{fontWeight:'bold', color:'var(--color-primary)'}}>Sab</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar-double">
                            <div className="bar ventas-bar" style={{height: '70%'}} title="$210.000"></div>
                            <div className="bar visitas-bar" style={{height: '85%'}}></div>
                          </div>
                          <span>Dom</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Productos */}
                  <div className="dashboard-panel top-products-panel">
                    <h3>Top Más Vendidos</h3>
                    <ul className="top-products-list">
                      <li>
                        <div className="tp-info"><span>1. Charizard Base Set</span><span>42 uds.</span></div>
                        <div className="tp-bar-bg"><div className="tp-bar-fill" style={{width: '90%'}}></div></div>
                      </li>
                      <li>
                        <div className="tp-info"><span>2. Booster Box OP-03</span><span>35 uds.</span></div>
                        <div className="tp-bar-bg"><div className="tp-bar-fill" style={{width: '75%'}}></div></div>
                      </li>
                      <li>
                        <div className="tp-info"><span>3. Black Lotus (Proxy)</span><span>28 uds.</span></div>
                        <div className="tp-bar-bg"><div className="tp-bar-fill" style={{width: '60%'}}></div></div>
                      </li>
                      <li>
                        <div className="tp-info"><span>4. Pikachu VMAX</span><span>15 uds.</span></div>
                        <div className="tp-bar-bg"><div className="tp-bar-fill" style={{width: '40%'}}></div></div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* TERCERA FILA: Categorías y Actividad */}
                <div className="dashboard-charts-row third-row">
                  
                  {/* Gráfico de Torta (CSS Conic Gradient) */}
                  <div className="dashboard-panel donut-panel">
                    <h3>Ventas por Categoría</h3>
                    <div className="donut-chart-container">
                      <div className="css-donut-chart">
                        <div className="donut-hole">
                          <span>60%</span>
                          <small>Pokémon</small>
                        </div>
                      </div>
                      <div className="donut-legend">
                        <div className="legend-item"><span className="dot poke"></span> Pokémon (60%)</div>
                        <div className="legend-item"><span className="dot magic"></span> Magic (25%)</div>
                        <div className="legend-item"><span className="dot one"></span> One Piece (15%)</div>
                      </div>
                    </div>
                  </div>

                  {/* Línea de Tiempo de Actividad */}
                  <div className="dashboard-panel activity-panel">
                    <h3>Registro de Actividad Reciente</h3>
                    <div className="activity-timeline">
                      <div className="activity-item">
                        <div className="activity-dot new-order"></div>
                        <div className="activity-content">
                          <p><strong>Nueva Orden #1024</strong> por $15.000</p>
                          <small>Hace 5 minutos</small>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-dot warning"></div>
                        <div className="activity-content">
                          <p>Alerta: <strong>Charizard VMAX</strong> bajo en stock (Quedan 2)</p>
                          <small>Hace 35 minutos</small>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-dot user"></div>
                        <div className="activity-content">
                          <p>Nuevo usuario registrado: <strong>m.gomez@gmail.com</strong></p>
                          <small>Hace 2 horas</small>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: INVENTORY LIST */}
            {activeTab === 'inventory' && (
              <div className="admin-view fade-in">
                <div className="admin-header-title flex-between">
                  <div>
                    <h2>Inventario de Productos</h2>
                    <p>Gestiona los productos disponibles en la tienda.</p>
                  </div>
                  <button className="btn-admin-action" onClick={() => setActiveTab('add-product')}>
                    <IonIcon icon={addOutline} /> Nuevo Producto
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryProducts.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td>#{item.id || idx + 100}</td>
                          <td className="product-cell">
                            <img src={item.image} alt={item.title} className="table-img" />
                            <span>{item.title}</span>
                          </td>
                          <td>{item.category || 'Pokémon TCG'}</td>
                          <td>
                            <span className={`stock-badge ${item.status === 'Sin Stock' ? 'stock-out' : 'stock-ok'}`}>
                              {item.status === 'Sin Stock' ? '0' : '12'}
                            </span>
                          </td>
                          <td>{typeof item.price === 'number' ? `$${item.price.toLocaleString('es-CL')}` : item.price}</td>
                          <td>
                            <button className="action-icon-btn edit"><IonIcon icon={createOutline} /></button>
                            <button className="action-icon-btn delete"><IonIcon icon={trashOutline} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ADD PRODUCT */}
            {activeTab === 'add-product' && (
              <div className="admin-view fade-in">
                <div className="admin-header-title flex-between">
                  <div>
                    <h2>Ingresar Nuevo Producto</h2>
                    <p>Agrega nuevas cartas o sellados al catálogo.</p>
                  </div>
                  <button className="btn-admin-secondary" onClick={() => setActiveTab('inventory')}>
                    Volver al Inventario
                  </button>
                </div>

                <div className="admin-card form-card">
                  {isSuccess && (
                    <div className="admin-alert-success">
                      ✅ ¡Producto agregado correctamente al catálogo! Redirigiendo...
                    </div>
                  )}

                  <form id="add-product-form" className="admin-form" onSubmit={handleAddProduct}>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Nombre del Producto</label>
                        <input type="text" placeholder="Ej: Charizard Holográfico" required />
                      </div>
                      <div className="form-group">
                        <label>Juego / Categoría</label>
                        <select required>
                          <option value="">Selecciona un juego...</option>
                          <option value="pokemon">Pokémon TCG</option>
                          <option value="magic">Magic: The Gathering</option>
                          <option value="onepiece">One Piece TCG</option>
                          <option value="otros">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Expansión / Set</label>
                        <input type="text" placeholder="Ej: Base Set 1999" required />
                      </div>
                      <div className="form-group">
                        <label>Condición</label>
                        <select required>
                          <option value="nm">Near Mint (NM)</option>
                          <option value="lp">Lightly Played (LP)</option>
                          <option value="mp">Moderately Played (MP)</option>
                          <option value="hp">Heavily Played (HP)</option>
                          <option value="sealed">Sellado (Nuevo)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Stock (Cantidad)</label>
                        <input type="number" min="1" placeholder="Ej: 5" required />
                      </div>
                      <div className="form-group">
                        <label>Precio (CLP)</label>
                        <input type="number" min="1" placeholder="Ej: 15000" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>URL de la Imagen</label>
                      <input type="url" placeholder="https://ejemplo.com/imagen.jpg" required />
                    </div>

                    <button type="submit" className="btn-admin-submit">
                      Guardar Producto
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="admin-view fade-in">
                <div className="admin-header-title">
                  <h2>Gestión de Órdenes</h2>
                  <p>Revisa y actualiza el estado de los pedidos.</p>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>N° Orden</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, idx) => (
                        <tr key={idx}>
                          <td><strong>{order.id}</strong></td>
                          <td>{order.client}</td>
                          <td>{order.date}</td>
                          <td>${order.total.toLocaleString('es-CL')}</td>
                          <td>
                            <select 
                              className={`status-select ${order.status.toLowerCase()}`}
                              value={order.status}
                              onChange={(e) => {
                                const newOrders = [...orders];
                                newOrders[idx].status = e.target.value;
                                setOrders(newOrders);
                              }}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Pagado">Pagado</option>
                              <option value="Enviado">Enviado</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn-small-outline">Ver Detalle</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
