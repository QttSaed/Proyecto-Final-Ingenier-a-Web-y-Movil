import { useState, type FormEvent } from 'react';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Legal.css';

const emptyForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [success, setSuccess] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.values(form).some(value => !value.trim())) return;
    setSuccess(true);
    setForm(emptyForm);
  }

  return (
    <IonPage>
      <IonHeader><TopBar /><Header /></IonHeader>
      <IonContent className="main-content legal-content">
        <main className="legal-container">
          <article className="legal-card">
            <header className="legal-header">
              <span className="legal-badge">TCGStore · Estamos para ayudarte</span>
              <h1>Contacto</h1>
              <p>Consulta por tu pedido, el estado de una carta o el retiro en tienda.</p>
            </header>
            <section className="legal-section" aria-labelledby="branches-title">
              <h2 id="branches-title">Nuestras sucursales</h2>
              <p>Visítanos en nuestras tiendas para retiros presenciales, dudas sobre el catálogo y asesoría personalizada en TCG.</p>
              <div className="contact-branches-grid">
                <section className="branch-card">
                  <h3>Sucursal Maipú</h3>
                  <address>Dirección 123, Maipú, Región Metropolitana.</address>
                  <p><strong>Horario de atención</strong><br />Lunes a viernes: 12:30 a 21:00 hrs<br />Sábado y domingo: 12:30 a 19:00 hrs</p>
                  <p><strong>Teléfono</strong><br /><a href="tel:+56912345678">+56 9 1234 5678</a></p>
                </section>
                <section className="branch-card">
                  <h3>Sucursal Los Leones</h3>
                  <address>Dirección 456, Providencia, Región Metropolitana.</address>
                  <p><strong>Horario de atención</strong><br />Lunes a viernes: 11:00 a 19:30 hrs<br />Sábado: 10:30 a 18:00 hrs</p>
                  <p><strong>Teléfono</strong><br /><a href="tel:+56987654321">+56 9 8765 4321</a></p>
                </section>
              </div>
            </section>
            <section className="contact-form-container" aria-labelledby="contact-title">
              <h2 id="contact-title">Escríbenos</h2>
              <p>Completa el formulario a continuación y te responderemos por correo dentro de las próximas 24 a 48 horas hábiles.</p>
              <div aria-live="polite" aria-atomic="true">
                {success && <p className="contact-alert" role="status">¡Gracias por contactarnos! Tu mensaje ha sido recibido con éxito. Nos pondremos en contacto contigo a la brevedad.</p>}
              </div>
              <form className="contact-form" onSubmit={submit} onChange={() => setSuccess(false)}>
                <div className="contact-group">
                  <label htmlFor="contact-name">Nombre</label>
                  <input id="contact-name" name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
                </div>
                <div className="contact-group">
                  <label htmlFor="contact-email">Correo electrónico</label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} />
                </div>
                <div className="contact-group contact-group-full">
                  <label htmlFor="contact-subject">Asunto</label>
                  <input id="contact-subject" name="subject" required maxLength={150} pattern=".*\S.*" value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} />
                </div>
                <div className="contact-group contact-group-full">
                  <label htmlFor="contact-message">Mensaje</label>
                  <textarea id="contact-message" name="message" required rows={6} maxLength={3000} value={form.message} onChange={event => {
                    event.target.setCustomValidity(event.target.value.trim() ? '' : 'Escribe un mensaje.');
                    setForm({ ...form, message: event.target.value });
                  }} />
                </div>
                <p className="contact-group-full">Consulta cómo tratamos tus datos en la <Link to="/privacidad">política de privacidad</Link>. No incluyas contraseñas ni datos de pago.</p>
                <button type="submit" className="contact-btn">Enviar mensaje</button>
              </form>
            </section>
          </article>
        </main>
        <Footer />
      </IonContent>
    </IonPage>
  );
}
