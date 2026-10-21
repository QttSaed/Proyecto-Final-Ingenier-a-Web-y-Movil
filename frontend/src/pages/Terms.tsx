import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Legal.css';

export default function Terms() {
  return (
    <IonPage>
      <IonHeader><TopBar /><Header /></IonHeader>
      <IonContent className="main-content legal-content">
        <main className="legal-container">
          <article className="legal-card">
            <header className="legal-header">
              <span className="legal-badge">TCGStore · Información para tu compra</span>
              <h1>Términos y condiciones</h1>
              <p>Conoce las condiciones de compra de cartas, productos sellados y accesorios en TCGStore.</p>
              <p className="legal-updated">Última actualización: <time dateTime="2026-10-21">21 de octubre de 2026</time></p>
            </header>
            <section className="legal-section">
              <h2>1. Catálogo y precios</h2>
              <p>Todos los precios se expresan en pesos chilenos (CLP), incluyen los impuestos aplicables y corresponden al producto indicado. Los gastos de despacho se informan por separado antes de confirmar la compra. Las promociones rigen durante el período y stock publicados; los cambios de precio no afectan compras ya confirmadas.</p>
              <p>Revisa la edición, idioma, variante, cantidad y estado de cada carta. Las imágenes de referencia pueden diferir de la unidad ofrecida; las características descritas en la ficha forman parte de la compra.</p>
            </section>
            <section className="legal-section">
              <h2>2. Compra y despacho</h2>
              <p>Debes proporcionar datos de contacto y entrega correctos y revisar el resumen antes de pagar. La confirmación identifica los productos, el total y la modalidad de entrega. Si un producto no está disponible, te contactaremos para acordar una alternativa o devolver lo pagado; no lo sustituiremos sin tu aceptación.</p>
              <p>Los plazos y costos de entrega se detallan en nuestra <Link to="/envios-devoluciones">política de envíos y devoluciones</Link>. Las preventas indicarán su fecha estimada de disponibilidad y cualquier cambio será comunicado.</p>
            </section>
            <section className="legal-section">
              <h2>3. Autenticidad y estado de las cartas</h2>
              <p>Comercializamos cartas originales. Si sospechas que una carta no es auténtica o no corresponde a lo ofrecido, solicita una revisión con tu comprobante y fotografías. No garantizamos una calificación específica de empresas de certificación ni el valor futuro de una carta.</p>
              <ul>
                <li><strong>Near Mint (NM):</strong> desgaste mínimo, con posibles marcas leves de manipulación.</li>
                <li><strong>Lightly Played (LP):</strong> señales leves de uso en bordes o superficie.</li>
                <li><strong>Moderately Played (MP):</strong> desgaste visible y más extendido.</li>
                <li><strong>Heavily Played / Played (HP):</strong> desgaste importante; revisa los detalles de la ficha.</li>
                <li><strong>Damaged (DMG):</strong> daños como dobleces o deterioro estructural, expresamente informados.</li>
              </ul>
              <p>Estas categorías describen el estado comercial de la carta. Los defectos declarados no justifican diferencias adicionales respecto de lo ofrecido. El contenido aleatorio de sobres y cajas no asegura cartas o rarezas específicas, salvo indicación expresa.</p>
            </section>
            <section className="legal-section">
              <h2>4. Cancelaciones y devoluciones</h2>
              <p>Puedes solicitar la cancelación antes del despacho. Si el pedido ya fue enviado, coordinaremos la devolución conforme a la política publicada y a tus derechos legales. Los productos nuevos defectuosos cuentan con garantía legal de seis meses cuando corresponda, con las opciones previstas por la ley.</p>
              <p>En compras a distancia puedes ejercer el retracto dentro de los diez días siguientes a la recepción, conforme a sus requisitos legales. Cualquier excepción legal aplicable debe informarse antes de comprar. Consulta el procedimiento de <Link to="/envios-devoluciones">devolución y reembolso</Link>.</p>
            </section>
            <section className="legal-section">
              <h2>5. Propiedad intelectual</h2>
              <p>Los textos, diseños y elementos propios de TCGStore están protegidos por las normas de propiedad intelectual. Las marcas, ilustraciones y nombres de los juegos pertenecen a sus respectivos titulares. La compra de un producto no transfiere derechos sobre esas obras ni autoriza su reproducción comercial.</p>
            </section>
            <section className="legal-section">
              <h2>6. Normativa y jurisdicción aplicable</h2>
              <p>Estas condiciones se rigen por la legislación chilena, incluida la Ley N.º 19.496 sobre protección de los derechos de los consumidores. Ninguna cláusula limita derechos irrenunciables. Las controversias podrán presentarse ante los tribunales competentes de Chile conforme a la ley, sin impedir que acudas al SERNAC.</p>
              <p>Las actualizaciones se publicarán con su fecha y regirán para compras posteriores. Puedes consultar información oficial sobre <a href="https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html">derechos en el comercio electrónico en SERNAC</a>.</p>
            </section>
            <aside className="legal-box">¿Necesitas ayuda? <Link to="/contacto">Consulta nuestros canales de contacto</Link>.</aside>
          </article>
        </main>
        <Footer />
      </IonContent>
    </IonPage>
  );
}
