import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonHeader, IonIcon, IonButton } from '@ionic/react';
import { logOutOutline, bagHandleOutline, personOutline, mailOutline, callOutline, mapOutline, createOutline } from 'ionicons/icons';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Profile.css';
import { apiService, ApiError, Order, money } from '../services/apiService';
import { localOrderService } from '../services/localOrderService';
import { Link } from 'react-router-dom';
import { authService, useAuth } from '../services/authService';
import { REGIONES_CHILE, getComunasPorRegion } from '../utils/chileData';

const Profile: React.FC = () => {

  const user = useAuth();
  const role = user?.role;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', region: '' });
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const toggleOrder = (orderId: string) => { setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] })); };
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarUrl]);

  useEffect(() => {
    let active = true;
    authService.getProfile().catch(error => {
      if (active) setProfileError(error instanceof Error ? error.message : 'No se pudo cargar el perfil.');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (editing) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [editing]);

  const openEditor = () => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      region: user?.region || ''
    });
    setSaveError('');
    setSuccess('');
    setEditing(true);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRegion = event.target.value;
    setForm(current => ({
      ...current,
      region: nextRegion,
      city: ''
    }));
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCity = event.target.value;
    setForm(current => ({
      ...current,
      city: nextCity
    }));
  };

  const comunasDisponibles = getComunasPorRegion(form.region);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (!form.name.trim()) {
      setSaveError('Ingresa tu nombre completo.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      await authService.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        region: form.region.trim()
      });
      setProfileError('');
      setEditing(false);
      setSuccess('Tus datos se actualizaron correctamente.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'No se pudo actualizar el perfil. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let active = true;
    setOrders([]);
    setError('');
    setOffline(false);
    if (role !== 'client' || !user) return;
    setLoading(true);
    apiService.orders().then(result => {
      if (active) setOrders(result);
    }).catch(requestError => {
      if (!active) return;
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setOrders(localOrderService.orders(user.email));
        setOffline(true);
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [role, user]);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <TopBar />
        <Header />
      </IonHeader>
      <IonContent className="main-content">
        <div className="profile-container">
          <h1 className="profile-title">Mi Cuenta</h1>
          {profileError && <p role="alert">{profileError}</p>}
          {success && <p className="profile-success" role="status">{success}</p>}

          <div className={`profile-grid ${role === 'admin' ? 'admin-layout' : ''}`}>
            <div className="profile-card user-info">
              <div className="profile-card-banner">
                <div className="profile-avatar">
                  {user?.avatarUrl && !avatarError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name ? `Avatar de ${user.name}` : 'Avatar de usuario'}
                      referrerPolicy="no-referrer"
                      className="profile-avatar-img"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <img
                      src="/assets/default-avatar.svg"
                      alt="Avatar de usuario"
                      className="profile-avatar-img"
                    />
                  )}
                </div>
              </div>
              <div className="profile-details-container">
                <h2 className="profile-name">{user?.name || 'Usuario Invitado'}</h2>
                <p className="profile-role-badge">{role === 'admin' ? 'Administrador' : 'Cliente'}</p>

                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <IonIcon icon={mailOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Correo Electrónico</span>
                      <span className="info-value">{user?.email || 'correo@tcgstore.com'}</span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <IonIcon icon={callOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Teléfono</span>
                      <span className="info-value">{user?.phone || 'Sin registrar'}</span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <IonIcon icon={mapOutline} className="info-icon" />
                    <div className="info-text">
                      <span className="info-label">Dirección de Envío</span>
                      <span className="info-value">{user?.address ? [user.address, user.city, user.region].filter(Boolean).join(', ') : 'Sin dirección registrada'}</span>
                    </div>
                  </div>
                </div>

                <button type="button" className="btn-edit-profile" onClick={openEditor} disabled={!user}>
                  <IonIcon icon={createOutline} aria-hidden="true" />
                  Editar datos de contacto y despacho
                </button>
                <IonButton fill="outline" expand="block" className="logout-btn" onClick={handleLogout}>
                  <IonIcon slot="start" icon={logOutOutline} />
                  Cerrar Sesión
                </IonButton>
              </div>
            </div>

            {role !== 'admin' && (
              <div className="profile-card user-orders">
                <div className="card-header">
                  <IonIcon icon={bagHandleOutline} />
                  <h2>Mis Órdenes</h2>
                </div>
                <div className="card-body">

                  {loading && <p role="status">Cargando tus órdenes…</p>}
                  {error && <p role="alert">{error}</p>}
                  {offline && <p>Sin conexión: mostrando las órdenes guardadas en este dispositivo.</p>}
                  {!loading && !error && orders.length === 0 && (
                    <p>Aún no tienes órdenes. <Link to="/catalog/todos">Explora el catálogo</Link> y encuentra tus próximas cartas.</p>
                  )}
                  {orders.map(order => {
                    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    const isExpanded = !!expandedOrders[order.id];
                    return (
                      <div className="order-item" key={order.id}>
                        <div className="order-header">
                          <span className="order-id">#{order.orderNumber || order.id}</span>
                          <span className="order-date">{new Date(order.date).toLocaleDateString('es-CL')}</span>
                        </div>
                        <div className="order-details">
                          <span>{quantity} {quantity === 1 ? 'Producto' : 'Productos'}</span>
                          <span className="order-total">{money(order.total)}</span>
                        </div>
                        <div className="order-actions-bar">
                          <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                          {order.items && order.items.length > 0 && (
                            <button
                              type="button"
                              className="btn-toggle-order-items"
                              onClick={() => toggleOrder(order.id)}
                              aria-expanded={isExpanded}
                              aria-label={isExpanded ? 'Ocultar detalle de cartas' : 'Ver detalle de cartas'}
                            >
                              {isExpanded ? 'Ocultar cartas ▲' : 'Ver detalle de cartas ▼'}
                            </button>
                          )}
                        </div>

                        {isExpanded && order.items && order.items.length > 0 && (
                          <div className="order-items-accordion">
                            <div className="order-items-header">
                              <span className="col-item-title">Carta / Producto</span>
                              <span className="col-item-qty">Cant.</span>
                              <span className="col-item-price">Precio</span>
                              <span className="col-item-subtotal">Subtotal</span>
                            </div>
                            <div className="order-items-body">
                              {order.items.map((item, idx) => (
                                <div className="order-item-row" key={idx}>
                                  <span className="col-item-title" title={item.title}>{item.title}</span>
                                  <span className="col-item-qty">x{item.quantity}</span>
                                  <span className="col-item-price">{money(item.unitPrice)}</span>
                                  <span className="col-item-subtotal">{money(item.unitPrice * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>
            )}
          </div>
        </div>
        <dialog ref={dialogRef} className="profile-modal-overlay" aria-labelledby="profile-edit-title"
          onCancel={event => { event.preventDefault(); if (!saving) setEditing(false); }}
          onClose={() => setEditing(false)}>
          <form className="profile-modal-card" onSubmit={saveProfile} aria-busy={saving}>
            <h2 id="profile-edit-title">Editar datos de contacto y despacho</h2>
            <fieldset disabled={saving}>
              <label htmlFor="profile-name">
                <span className="profile-label-text">Nombre completo *</span>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={form.name}
                  onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
                />
              </label>

              <label htmlFor="profile-phone">
                <span className="profile-label-text">Teléfono de contacto</span>
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+56 9 1234 5678"
                  value={form.phone}
                  onChange={event => setForm(current => ({ ...current, phone: event.target.value }))}
                />
              </label>

              <label htmlFor="profile-address">
                <span className="profile-label-text">Dirección de despacho (Calle y número)</span>
                <input
                  id="profile-address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Ej. Av. Providencia 1234, Depto 501"
                  value={form.address}
                  onChange={event => setForm(current => ({ ...current, address: event.target.value }))}
                />
              </label>

              <label htmlFor="profile-region">
                <span className="profile-label-text">Región</span>
                <select
                  id="profile-region"
                  name="region"
                  value={form.region}
                  onChange={handleRegionChange}
                >
                  <option value="">-- Selecciona una región --</option>
                  {REGIONES_CHILE.map(r => (
                    <option key={r.nombre} value={r.nombre}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="profile-city">
                <span className="profile-label-text">Ciudad / Comuna</span>
                <select
                  id="profile-city"
                  name="city"
                  value={form.city}
                  onChange={handleCityChange}
                  disabled={!form.region}
                >
                  <option value="">
                    {form.region ? '-- Selecciona tu comuna --' : '-- Primero selecciona una región --'}
                  </option>
                  {form.city && !comunasDisponibles.includes(form.city) && (
                    <option value={form.city}>{form.city}</option>
                  )}
                  {comunasDisponibles.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>

            {saveError && <p className="profile-save-error" role="alert">{saveError}</p>}
            <div className="profile-modal-actions">
              <button type="button" className="profile-cancel" disabled={saving} onClick={() => setEditing(false)}>Cancelar</button>
              <button type="submit" className="profile-save" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
            </div>
          </form>
        </dialog>
        <Footer />
      </IonContent>
    </>
  );
};

export default Profile;
