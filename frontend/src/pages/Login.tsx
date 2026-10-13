import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader } from '@ionic/react';
import { logoGoogle, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const location = useLocation();
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ block: 'center' });
  }, [error]);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    if (!form.checkValidity()) { setError('Ingresa un correo válido y tu contraseña.'); return; }
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    setError(''); setSubmitting(true);
    try {
      const user = await authService.login(email, password);
      const from = location.state?.from;
      const destination = typeof from === 'string' && /^\/(?!\/)/.test(from) && !['/login', '/register'].includes(from) ? from : '/perfil';
      navigate(user.role === 'admin' ? '/admin' : destination, { replace: true });
    } catch { setError('Correo o contraseña incorrectos'); }
    finally { setSubmitting(false); }
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

            <form noValidate className="login-form" onSubmit={handleLogin}>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico *</label>
                <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" autoComplete="email" required />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Contraseña *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password" name="password" autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" className="password-toggle-button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword(!showPassword)}><IonIcon
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    className="password-toggle-icon"
                  /></button>
                </div>
              </div>

              <p className="form-hint">Contraseñas nuevas: mínimo 8 caracteres, una letra y un número.</p>
              {location.state?.registered && <p role="status">Cuenta creada. Ya puedes iniciar sesión.</p>}
              <div className="forgot-password">
                <Link to="/coming-soon">¿Olvidaste tu contraseña?</Link>
              </div>

              <p ref={errorRef} role="alert" className="form-error">{error}</p>
              <button type="submit" className="btn-login" disabled={submitting}>{submitting ? "Ingresando…" : "Ingresar a mi cuenta"}</button>

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
