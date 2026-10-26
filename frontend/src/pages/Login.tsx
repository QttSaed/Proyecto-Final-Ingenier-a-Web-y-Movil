import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonIcon, IonHeader } from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';
import VerificationResend from '../components/VerificationResend';
import { ApiError } from '../services/apiService';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const location = useLocation();
  const [error, setError] = useState('');
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
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
    setError(''); setVerificationEmail(null); setSubmitting(true);
    try {
      const user = await authService.login(email, password);
      const from = location.state?.from;
      const destination = typeof from === 'string' && /^\/(?!\/)/.test(from) && !['/login', '/register'].includes(from) ? from : '/perfil';
      navigate(user.role === 'admin' ? '/admin' : destination, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión. Intenta nuevamente.';
      setError(message);
      if ((err instanceof ApiError && err.status === 403) || /verific|activación|unverified/i.test(message)) {
        setVerificationEmail(email.trim().toLowerCase());
      }
    }
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
              {location.state?.registered && <p role="status">Cuenta creada. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.</p>}
              <div className="forgot-password">
                <Link to="/coming-soon">¿Olvidaste tu contraseña?</Link>
              </div>

              <p ref={errorRef} role="alert" className="form-error">{error}</p>
              <button type="submit" className="btn-login" disabled={submitting}>{submitting ? "Ingresando…" : "Ingresar a mi cuenta"}</button>

            </form>

            {verificationEmail && <section className="verify-alert" aria-label="Verificación de correo">
              <p>Verifica tu correo para activar tu cuenta. Puedes solicitar un nuevo enlace.</p>
              <VerificationResend key={verificationEmail} initialEmail={verificationEmail} />
            </section>}

            <div className="login-divider">
              <span>O ingresar con</span>
            </div>

            <div className="google-btn-container">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;
                  setSubmitting(true);
                  setError('');
                  setVerificationEmail(null);
                  try {
                    const user = await authService.loginWithGoogle(credentialResponse.credential);
                    const from = location.state?.from;
                    const destination = typeof from === 'string' && /^\/(?!\/)/.test(from) && !['/login', '/register'].includes(from) ? from : '/perfil';
                    navigate(user.role === 'admin' ? '/admin' : destination, { replace: true });
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error al autenticar con Google');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                onError={() => setError('No se pudo completar el inicio de sesión con Google')}
                text="continue_with"
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

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
