import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import {
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { Link, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services/authService';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const hasLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('El token de restablecimiento es inválido o no está presente. Solicita un nuevo enlace.');
      return;
    }

    if (!hasLength || !hasLetter || !hasNumber) {
      setError('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña. El enlace puede haber expirado.');
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
        <main className="reset-container">
          <section className="reset-card" aria-labelledby="reset-title">
            {!token ? (
              <div className="reset-content missing-token">
                <div className="reset-icon-circle error">
                  <IonIcon icon={alertCircleOutline} />
                </div>
                <h1 id="reset-title">Enlace no válido</h1>
                <p className="reset-desc">
                  No se encontró el token de seguridad necesario para restablecer tu contraseña. El enlace podría estar incompleto o haber caducado.
                </p>
                <div className="reset-actions">
                  <Link to="/recuperar-contrasena" className="btn-reset-primary">
                    Solicitar nuevo enlace
                  </Link>
                  <Link to="/login" className="btn-reset-secondary">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            ) : success ? (
              <div className="reset-content success-state">
                <div className="reset-icon-circle success">
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
                <h1 id="reset-title">¡Contraseña restablecida!</h1>
                <p className="reset-desc">
                  Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales en TCGStore.
                </p>
                <div className="reset-actions">
                  <Link to="/login" className="btn-reset-primary">
                    Iniciar Sesión Ahora
                  </Link>
                </div>
              </div>
            ) : (
              <div className="reset-content">
                <div className="reset-icon-circle">
                  <IonIcon icon={lockClosedOutline} />
                </div>
                <h1 id="reset-title">Crea una nueva contraseña</h1>
                <p className="reset-desc">
                  Ingresa tu nueva contraseña para acceder de forma segura a tu cuenta.
                </p>

                {error && (
                  <div className="reset-alert error" role="alert">
                    <IonIcon icon={alertCircleOutline} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="reset-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="reset-password">Nueva Contraseña *</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="reset-password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="password-toggle-button"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                      </button>
                    </div>
                  </div>

                  <div className="password-requirements">
                    <p className="req-title">Tu contraseña debe contener:</p>
                    <ul>
                      <li className={hasLength ? 'valid' : ''}>
                        <span className="req-bullet">{hasLength ? '✓' : '•'}</span> Al menos 8 caracteres
                      </li>
                      <li className={hasLetter ? 'valid' : ''}>
                        <span className="req-bullet">{hasLetter ? '✓' : '•'}</span> Al menos una letra
                      </li>
                      <li className={hasNumber ? 'valid' : ''}>
                        <span className="req-bullet">{hasNumber ? '✓' : '•'}</span> Al menos un número
                      </li>
                    </ul>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reset-confirm-password">Confirmar Contraseña *</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="reset-confirm-password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="password-toggle-button"
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={`match-hint ${passwordsMatch ? 'valid' : 'invalid'}`}>
                        {passwordsMatch ? '✓ Las contraseñas coinciden' : '✕ Las contraseñas no coinciden'}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-reset-submit"
                    disabled={submitting || !hasLength || !hasLetter || !hasNumber || !passwordsMatch}
                  >
                    {submitting ? (
                      <>
                        <IonSpinner name="crescent" />
                        <span>Actualizando contraseña...</span>
                      </>
                    ) : (
                      'Restablecer Contraseña'
                    )}
                  </button>
                </form>

                <div className="reset-footer">
                  <Link to="/login" className="back-link">
                    <IonIcon icon={arrowBackOutline} />
                    <span>Volver al inicio de sesión</span>
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

export default ResetPassword;
