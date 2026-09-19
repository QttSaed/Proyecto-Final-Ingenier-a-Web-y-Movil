import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader } from '@ionic/react';
import { logoGoogle, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [wasLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  if (wasLoggedIn) {
    return <Navigate to="/perfil" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const passInput = (document.getElementById('password') as HTMLInputElement).value;

    const mockUsers = [
      { email: 'admin@tcgstore.com', pass: '123456', role: 'admin', name: 'Administrador' },
      { email: 'cliente@tcgstore.com', pass: '123456', role: 'client', name: 'Juan Pérez' }
    ];

    const foundUser = mockUsers.find(u => u.email === emailInput && u.pass === passInput);

    if (foundUser) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', foundUser.email);
      localStorage.setItem('userName', foundUser.name);
      localStorage.setItem('role', foundUser.role);
      navigate('/perfil');
    } else {
      alert('Credenciales incorrectas. Intenta con admin@tcgstore.com o cliente@tcgstore.com y clave 123456');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <TopBar />
        <Header />
      </IonHeader>
      <IonContent className="main-content">

        <div className="login-container">
          <div className="login-card">

            <div className="login-header">
              <h1>¡Hola de nuevo!</h1>
              <p>Inicia sesión en TCGStore para continuar.</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" placeholder="ejemplo@correo.com" required />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    required
                  />
                  <IonIcon
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              <div className="forgot-password">
                <Link to="/coming-soon">¿Olvidaste tu contraseña?</Link>
              </div>

              <button type="submit" className="btn-login">Ingresar a mi cuenta</button>

            </form>

            <div className="login-divider">
              <span>O ingresar con</span>
            </div>

            <Link to="/coming-soon" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
              <button className="btn-google">
                <IonIcon icon={logoGoogle} style={{ fontSize: '20px' }} />
                Continuar con Google
              </button>
            </Link>

            <div className="register-link">
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </div>

          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Login;
