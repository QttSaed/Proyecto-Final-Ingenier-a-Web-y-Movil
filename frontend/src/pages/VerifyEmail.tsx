import { useEffect, useRef, useState } from 'react';
import { IonContent, IonHeader, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { checkmarkCircleOutline, mailOutline, alertCircleOutline } from 'ionicons/icons';
import { Link, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VerificationResend from '../components/VerificationResend';
import { authService } from '../services/authService';
import './VerifyEmail.css';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() || '';
  const request = useRef<{ token: string; promise: ReturnType<typeof authService.verifyEmail> } | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'missing'>(token ? 'loading' : 'missing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    if (!token) { setStatus('missing'); setMessage(''); return; }
    setStatus('loading');
    setMessage('');
    if (request.current?.token !== token) {
      request.current = { token, promise: authService.verifyEmail(token) };
    }
    request.current.promise.then(result => {
      if (active) { setStatus('success'); setMessage(result.message); }
    }).catch(error => {
      if (active) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'No se pudo verificar tu correo. Solicita un nuevo enlace.');
      }
    });
    return () => { active = false; };
  }, [token]);

  return <IonPage>
    <IonHeader><TopBar /><Header /></IonHeader>
    <IonContent className="main-content">
      <main className="verify-container">
        <section className="verify-card" aria-labelledby="verify-title" aria-busy={status === 'loading'}>
          <div className={`verify-icon ${status === 'success' ? 'verify-icon-success' : ''}`}>
            {status === 'loading' ? <IonSpinner name="crescent" aria-label="Verificando correo" /> :
              <IonIcon aria-hidden="true" icon={status === 'success' ? checkmarkCircleOutline : status === 'error' ? alertCircleOutline : mailOutline} />}
          </div>
          <h1 id="verify-title" className="verify-status-title">{status === 'loading' ? 'Verificando tu correo' : status === 'success' ? '¡Correo verificado!' : status === 'error' ? 'No pudimos verificar tu correo' : 'Verifica tu correo'}</h1>
          {status === 'loading' && <p className="verify-text" role="status">Estamos activando tu cuenta. Espera un momento.</p>}
          {status === 'success' && <>
            <p className="verify-text" role="status">{message} Tu cuenta está lista para disfrutar de TCGStore.</p>
            <div className="verify-actions"><Link className="btn-verify-primary" to="/perfil">Ir a mi perfil</Link><Link className="btn-verify-secondary" to="/home">Volver al inicio</Link></div>
          </>}
          {(status === 'error' || status === 'missing') && <>
            <p className="verify-text" role={status === 'error' ? 'alert' : undefined}>{status === 'error' ? message : 'No se proporcionó un enlace de verificación. Ingresa tu correo para recibir uno nuevo.'}</p>
            <VerificationResend />
            <Link className="btn-verify-secondary" to="/login">Volver a iniciar sesión</Link>
          </>}
        </section>
      </main>
      <Footer />
    </IonContent>
  </IonPage>;
}
