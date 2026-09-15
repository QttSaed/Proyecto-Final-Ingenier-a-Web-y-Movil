import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="main-content">
        <TopBar />
        <Header />

        <div className="login-container">
          <div className="login-card">
            
            <div className="login-header">
              <h1>¡Hola de nuevo!</h1>
              <p>Inicia sesión en TCGStore para continuar.</p>
            </div>

            <form className="login-form" onSubmit={(e) => { e.preventDefault(); alert('¡Simulación de Login exitosa!'); }}>
              
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" placeholder="ejemplo@correo.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" placeholder="••••••••" required />
              </div>

              <div className="forgot-password">
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-login">Ingresar a mi cuenta</button>

            </form>

            <div className="login-divider">
              <span>O ingresar con</span>
            </div>

            <button className="btn-google">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" />
              Continuar con Google
            </button>

            <div className="register-link">
              ¿No tienes cuenta? <Link to="/login">Regístrate aquí</Link>
            </div>

          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Login;
