import React from 'react';
import { Link } from 'react-router-dom';
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
            <li><Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none'}}>Envíos</Link></li>
            <li><Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none'}}>Términos y condiciones</Link></li>
            <li><Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none'}}>Contacto</Link></li>
          </ul>
          <div className="footer-socials">
            <Link to="/coming-soon" style={{color: 'inherit'}}><IonIcon icon={logoFacebook} /></Link>
            <Link to="/coming-soon" style={{color: 'inherit'}}><IonIcon icon={logoInstagram} /></Link>
            <Link to="/coming-soon" style={{color: 'inherit'}}><IonIcon icon={logoTiktok} /></Link>
          </div>
        </div>

        <div className="footer-col logo-col">
          <div className="footer-logo-placeholder">TCGStore<br/><span>TCG & COLLECTIBLE STORE</span></div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          © 2026, TCGStore • 
          <Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none', marginLeft: '5px', marginRight: '5px'}}>Política de privacidad</Link> • 
          <Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none', marginLeft: '5px', marginRight: '5px'}}>Política de reembolso</Link> • 
          <Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none', marginLeft: '5px', marginRight: '5px'}}>Términos del servicio</Link> • 
          <Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none', marginLeft: '5px', marginRight: '5px'}}>Política de envío</Link> • 
          <Link to="/coming-soon" style={{color: 'inherit', textDecoration: 'none', marginLeft: '5px', marginRight: '5px'}}>Información de contacto</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
