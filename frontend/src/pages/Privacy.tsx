import { useRef } from 'react';
import { IonContent, IonHeader, IonPage, useIonViewDidEnter } from '@ionic/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { scrollToTop } from '../utils/scrollToTop';
import './Legal.css';

export default function Privacy() {
  const contentRef = useRef<HTMLIonContentElement>(null);

  useIonViewDidEnter(() => {
    contentRef.current?.scrollToTop(0);
    scrollToTop(false);
  });

  return (
    <IonPage>
      <IonHeader><TopBar /><Header /></IonHeader>
      <IonContent ref={contentRef} className="main-content legal-content">
        <main className="legal-container">
          <article className="legal-card">
            <header className="legal-header">
              <span className="legal-badge">TCGStore · Información para tu compra</span>
              <h1>Política de privacidad</h1>
              <p>Te explicamos qué información usamos para gestionar tu cuenta y tus compras.</p>
              <p className="legal-updated">Última actualización: <time dateTime="2026-10-21">21 de octubre de 2026</time></p>
            </header>
            <section className="legal-section">
              <h2>1. Datos recopilados</h2>
              <p>TCGStore trata el nombre, correo electrónico y datos de cuenta que entregas al registrarte. Para gestionar pedidos utilizamos los datos de contacto, teléfono, dirección de despacho, productos comprados y antecedentes necesarios para la entrega y comprobantes. Entrega solo la información necesaria y evita incluir datos sensibles en tus consultas.</p>
            </section>
            <section className="legal-section">
              <h2>2. Uso y comunicación de la información</h2>
              <p>Utilizamos estos datos para autenticar tu cuenta, preparar pedidos, coordinar entregas, atender consultas y gestionar devoluciones. Solo compartimos con transportistas y proveedores que intervienen en la compra la información necesaria para prestar su servicio, o con autoridades cuando exista una obligación legal. No vendemos tus datos personales.</p>
              <p>Las comunicaciones comerciales requieren la autorización que corresponda y puedes solicitar dejar de recibirlas. Conservamos los antecedentes mientras sean necesarios para estos fines y para cumplir obligaciones legales y contables.</p>
            </section>
            <section className="legal-section">
              <h2>3. Contraseñas y seguridad de la cuenta</h2>
              <p>Las contraseñas se almacenan como hashes bcrypt; no se guardan en texto plano ni se pueden recuperar desde el hash. El acceso a la API utiliza tokens JWT firmados y con vencimiento. Un JWT acredita una sesión: no cifra por sí mismo los datos ni reemplaza una conexión HTTPS.</p>
              <p>No compartas tu contraseña ni tus tokens. Cierra sesión en equipos compartidos y avísanos si detectas accesos desconocidos. Los controles de acceso y la limitación de datos ayudan a reducir riesgos, aunque ningún sistema puede garantizar seguridad absoluta.</p>
            </section>
            <section className="legal-section">
              <h2>4. Cookies y almacenamiento del navegador</h2>
              <p>La aplicación utiliza almacenamiento del navegador para la sesión, el carrito y preferencias. El token y los datos básicos de la cuenta se guardan en sessionStorage y se retiran al cerrar sesión. Este almacenamiento no equivale a una cookie HttpOnly y puede ser leído por scripts del mismo sitio; evita usar la cuenta en equipos no confiables.</p>
              <p>Puedes eliminar el almacenamiento desde tu navegador, lo que puede cerrar tu sesión o borrar preferencias. Si se incorporan cookies de analítica o publicidad, se informarán sus finalidades y se solicitará el consentimiento cuando corresponda.</p>
            </section>
            <section className="legal-section">
              <h2>5. Derechos del titular</h2>
              <p>Puedes solicitar información sobre tus datos, corregir datos inexactos y pedir su eliminación o bloqueo cuando corresponda conforme a la Ley N.º 19.628 y a la normativa vigente. Para ejercer estos derechos, utiliza los canales de <Link to="/contacto">contacto</Link> e indica la solicitud y un medio de respuesta. Podremos verificar tu identidad sin pedir tu contraseña.</p>
              <p>Algunos antecedentes deben conservarse por obligación legal; te informaremos si ello impide atender íntegramente una solicitud. Consulta la <a href="https://www.bcn.cl/leychile/Navegar?dt=open&amp;idLey=19628">Ley N.º 19.628 en la Biblioteca del Congreso Nacional</a>.</p>
            </section>
            <aside className="legal-box">¿Necesitas ayuda? <Link to="/contacto">Consulta nuestros canales de contacto</Link>.</aside>
          </article>
        </main>
        <Footer />
      </IonContent>
    </IonPage>
  );
}
