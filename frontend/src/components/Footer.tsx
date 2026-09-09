import React from 'react';
import { IonIcon } from '@ionic/react';
import { logoFacebook, logoInstagram, logoTiktok } from 'ionicons/icons';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h3>Sucursal Maipú</h3>
          <p>Dirección ficticia 123, Maipú, Región Metropolitana.</p>
          <br/>
          <p>Horario de atención:<br/>Lunes a Viernes: 12:30 a 21:00 hrs<br/>Sábado y Domingo: 12:30 a 19:00 hrs</p>
          <br/>
          <p>Teléfono<br/>+56 9 1234 5678</p>
        </div>
        
        <div className="footer-col">
          <h3>Sucursal Los Leones</h3>
          <p>Dirección ficticia 456, Providencia, Región Metropolitana.</p>
          <br/>
          <p>Horario de atención:<br/>Lunes a Viernes: 11:00 a 19:30 hrs<br/>Sábado: 10:30 a 18:00 hrs</p>
          <br/>
          <p>Teléfono<br/>+56 9 8765 4321</p>
        </div>

        <div className="footer-col">
          <h3>Nosotros</h3>
          <ul>
            <li>Envíos</li>
            <li>Términos y condiciones</li>
            <li>Contacto</li>
          </ul>
          <div className="footer-socials">
            <IonIcon icon={logoFacebook} />
            <IonIcon icon={logoInstagram} />
            <IonIcon icon={logoTiktok} />
          </div>
        </div>

        <div className="footer-col logo-col">
          <div className="footer-logo-placeholder">TCGStore<br/><span>TCG & COLLECTIBLE STORE</span></div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          © 2026, TCGStore • Política de privacidad • Política de reembolso • Términos del servicio • Política de envío • Información de contacto
        </div>
      </div>
    </footer>
  );
};

export default Footer;
