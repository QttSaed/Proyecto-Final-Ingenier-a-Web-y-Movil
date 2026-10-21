import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonHeader, IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';
import { mailOpenOutline } from 'ionicons/icons';
import { VerificationLocalLink } from '../components/VerificationResend';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Register.css';
import { authService } from '../services/authService';

const Register: React.FC = () => {
  const [registered, setRegistered] = useState<{ email: string; verificationUrl?: string | null } | null>(null);

  const [error, setError] = useState('');
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ block: 'center' });
  }, [error]);
  const [submitting, setSubmitting] = useState(false);
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    if (!form.checkValidity()) { setError('Completa los campos obligatorios, usa un correo válido y una contraseña de 8 caracteres con letra y número, y acepta los términos.'); return; }
    const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;
    setError('');
    if (value('password') !== value('confirmPassword')) { setError('Las contraseñas deben coincidir.'); return; }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value('password'))) { setError('La contraseña debe tener 8 caracteres, una letra y un número como mínimo.'); return; }
    setSubmitting(true);
    try {
      const result = await authService.register(`${value('nombre')} ${value('apellido')}`, value('email'), value('password'));
      setRegistered({ email: result.email || value('email').trim().toLowerCase(), verificationUrl: result.verificationUrl });
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta. Intenta nuevamente.'); }
    finally { setSubmitting(false); }
  };

  return (
    <IonPage>
      <IonHeader>
      <TopBar />
      <Header />
    </IonHeader>
    <IonContent className="main-content">

        <div className="register-container">
          <div className="register-card">
            
            {registered ? <div className="register-confirmation" role="status">
              <div className="verify-icon"><IonIcon icon={mailOpenOutline} aria-hidden="true" /></div>
              <h1 className="verify-status-title">¡Cuenta creada con éxito!</h1>
              <p className="verify-text">Hemos enviado un enlace de activación a <strong>{registered.email}</strong>. Revisa tu bandeja de entrada para verificar tu cuenta antes de iniciar sesión.</p>
              <VerificationLocalLink url={registered.verificationUrl} />
              <Link className="btn-verify-primary" to="/login">Ir a Iniciar Sesión</Link>
            </div> : <>
            <div className="register-header">
              <h1>Crear Cuenta</h1>
              <p>Únete a TCGStore y gestiona tus pedidos fácilmente.</p>
            </div>

            <form noValidate className="register-form" onSubmit={handleRegister}>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input type="text" id="nombre" name="nombre" placeholder="Juan" required />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <input type="text" id="apellido" name="apellido" placeholder="Pérez" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico *</label>
                <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" autoComplete="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <input type="password" id="password" name="password" autoComplete="new-password" minLength={8} pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}" placeholder="••••••••" required />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" placeholder="••••••••" required />
              </div>

              <p className="form-hint">Formato de correo: nombre@dominio.cl. Contraseña: mínimo 8 caracteres, una letra y un número.</p>
              <div className="terms-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  He leído y acepto los <Link to="/coming-soon">Términos de Servicio</Link> y la <Link to="/coming-soon">Política de Privacidad</Link> de TCGStore.
                </label>
              </div>

              <p ref={errorRef} role="alert" className="form-error">{error}</p>
              <button type="submit" className="btn-register" disabled={submitting}>{submitting ? "Creando cuenta…" : "Crear mi cuenta"}</button>

            </form>

            <div className="login-link">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </div>

            </>}
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Register;

