import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import { mailOutline, arrowBackOutline, checkmarkCircleOutline, alertCircleOutline, sendOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services/authService';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const normalized = email.trim().toLowerCase();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.forgotPassword(normalized);
      setSubmitted(true);
      if (response.resetUrl) {
        setDevResetUrl(response.resetUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la solicitud. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <TopBar />
        <Header />
      </IonHeader>

      <IonContent className="main-content">
        <main className="recovery-container">
          <section className="recovery-card" aria-labelledby="recovery-title">
            {submitted ? (
              <div className="recovery-success-content">
                <div className="recovery-icon-circle success">
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
                <h1 id="recovery-title">Revisa tu correo</h1>
                <p className="recovery-desc">
                  Si la dirección <strong>{email}</strong> está registrada en TCGStore, recibirás un correo con las instrucciones y el enlace para restablecer tu contraseña.
                </p>
                <div className="recovery-info-box">
                  <p>• El enlace tiene una vigencia de <strong>1 hora</strong>.</p>
                  <p>• Si no lo ves en tu bandeja de entrada, revisa tu carpeta de <em>Spam</em> o <em>Promociones</em>.</p>
                </div>

                {devResetUrl && (
                  <div className="dev-helper-box">
                    <p className="dev-tag">Modo local (desarrollo):</p>
                    <a href={devResetUrl} className="dev-link">
                      Abrir enlace de restablecimiento directo
                    </a>
                  </div>
                )}

                <div className="recovery-actions">
                  <Link to="/login" className="btn-recovery-primary">
                    Volver a Iniciar Sesión
                  </Link>
                  <button
                    type="button"
                    className="btn-recovery-link"
                    onClick={() => { setSubmitted(false); setDevResetUrl(null); }}
                  >
                    Probar con otro correo
                  </button>
                </div>
              </div>
            ) : (
              <div className="recovery-form-content">
                <div className="recovery-icon-circle">
                  <IonIcon icon={mailOutline} />
                </div>
                <h1 id="recovery-title">¿Olvidaste tu contraseña?</h1>
                <p className="recovery-desc">
                  No te preocupes. Ingresa tu correo electrónico registrado y te enviaremos un enlace seguro para crear una nueva contraseña.
                </p>

                {error && (
                  <div className="recovery-alert error" role="alert">
                    <IonIcon icon={alertCircleOutline} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="recovery-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="recovery-email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="recovery-email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      autoComplete="email"
                      required
                      autoFocus
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-recovery-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <IonSpinner name="crescent" />
                        <span>Enviando enlace...</span>
                      </>
                    ) : (
                      <>
                        <IonIcon icon={sendOutline} />
                        <span>Enviar enlace de recuperación</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="recovery-footer">
                  <Link to="/login" className="back-link">
                    <IonIcon icon={arrowBackOutline} />
                    <span>Volver a Iniciar Sesión</span>
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
