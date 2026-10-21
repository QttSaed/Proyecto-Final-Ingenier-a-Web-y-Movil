import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Legal.css';

export default function ShippingReturns() {
  return (
    <IonPage>
      <IonHeader><TopBar /><Header /></IonHeader>
      <IonContent className="main-content legal-content">
        <main className="legal-container">
          <article className="legal-card">
            <header className="legal-header">
              <span className="legal-badge">TCGStore · Información para tu compra</span>
              <h1>Envíos y devoluciones</h1>
              <p>Opciones de entrega en Chile y pasos para resolver un problema con tu pedido.</p>
              <p className="legal-updated">Última actualización: <time dateTime="2026-10-21">21 de octubre de 2026</time></p>
            </header>
            <section className="legal-section">
              <h2>1. Transportistas y cobertura</h2>
              <p>Coordinamos envíos dentro de Chile mediante Chilexpress, Starken o Blue Express, según disponibilidad y cobertura de la comuna. La modalidad y el costo se informan antes de confirmar la compra. Revisa que la dirección y el teléfono sean correctos; si necesitas cambiarlos, contáctanos antes del despacho.</p>
            </section>
            <section className="legal-section">
              <h2>2. Preparación y tiempos de entrega</h2>
              <p>Los pedidos confirmados de productos disponibles se preparan para despacho dentro de 24 horas hábiles. Como referencia, el transporte puede tardar de 1 a 3 días hábiles en la Región Metropolitana y de 3 a 7 en otras regiones; zonas extremas o aisladas pueden requerir más tiempo. El plazo aplicable se informa al coordinar la entrega.</p>
              <p>Estos plazos no incluyen fines de semana ni festivos. Las preventas se despachan desde su disponibilidad informada. Conserva el número de seguimiento y contáctanos si hay atrasos, extravíos o daños; te ayudaremos a gestionar la solución con el transportista.</p>
            </section>
            <section className="legal-section">
              <h2>3. Envío gratis y retiro en tienda</h2>
              <div className="legal-box"><strong>Envío gratis en compras sobre $50.000 CLP.</strong><p>El beneficio se calcula sobre el subtotal de productos después de descuentos. Para montos inferiores, revisa el cargo de despacho antes de pagar.</p></div><p>El retiro no tiene costo en nuestras sucursales Maipú y Los Leones. Espera la confirmación de que tu pedido está listo y presenta el número de orden y un documento que permita identificar al comprador. Si retira otra persona, coordina su autorización previamente. Consulta <Link to="/contacto">direcciones y horarios</Link>.</p>
            </section>
            <section className="legal-section">
              <h2>4. Devoluciones, retracto y garantía</h2>
              <p>Para iniciar una solicitud, comunícate por los canales de <Link to="/contacto">contacto</Link> e indica el número de pedido, los productos y el motivo. Si existe daño, un error o una diferencia de estado, las fotografías nos ayudarán a revisar el caso sin sustituir tus derechos legales. Conserva el producto y sus accesorios mientras coordinamos la solución.</p>
              <p>El retracto de una compra a distancia puede ejercerse dentro de diez días desde la recepción, con los requisitos y excepciones previstos por la ley e informados antes de comprar. Para este derecho, conserva el producto sin uso y los elementos originales que corresponda restituir. Abrir productos sellados puede afectar las condiciones de restitución; no elimina la garantía por defectos.</p>
              <p>Los productos nuevos defectuosos tienen garantía legal de seis meses cuando corresponda: puedes optar por reparación, cambio o devolución del dinero en los términos legales. El desgaste de una carta usada expresamente informado se evalúa de acuerdo con lo ofrecido; una carta distinta o con daños no declarados requiere revisión.</p>
            </section>
            <section className="legal-section">
              <h2>5. Reembolsos y costos de devolución</h2>
              <p>Confirmaremos la recepción de la solicitud, las instrucciones de devolución y el importe correspondiente. El reembolso se realizará preferentemente por el medio de pago original; cualquier alternativa se acordará contigo. No se impondrá un saldo en tienda como única solución cuando corresponda devolver dinero.</p>
              <p>En caso de error nuestro o producto defectuoso, coordinaremos la devolución sin costo para ti. Para retractos, informaremos los costos aplicables conforme a la ley. Cuando se ejerza el retracto, se restituirán las sumas que legalmente correspondan dentro del plazo legal, que no excederá de 45 días desde su comunicación; el abono bancario puede depender del emisor.</p>
            </section>
            <section className="legal-section">
              <h2>6. Restitución de inventario</h2>
              <p>Los pedidos cancelados liberan las unidades reservadas. Las unidades devueltas se reincorporan al inventario después de verificar su identidad, integridad y estado. Una carta con desgaste adicional se reclasifica antes de volver a ofrecerse; un producto abierto no se publica como sellado. Esta revisión no limita los derechos ni los plazos legales del reembolso.</p>
              <p>Revisa también la orientación oficial de <a href="https://www.sernac.cl/portal/604/w3-propertyvalue-8062.html">SERNAC sobre garantía legal y retracto</a>.</p>
            </section>
            <aside className="legal-box">¿Necesitas ayuda? <Link to="/contacto">Consulta nuestros canales de contacto</Link>.</aside>
          </article>
        </main>
        <Footer />
      </IonContent>
    </IonPage>
  );
}
