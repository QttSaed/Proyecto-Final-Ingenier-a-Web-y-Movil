import { useState } from 'react';
import { authService } from '../services/authService';
import '../pages/VerifyEmail.css';

export function VerificationLocalLink({ url }: { url?: string | null }) {
  if (!url) return null;
  return <div className="verify-local-box">
    <p>Modo local: Puedes activar tu cuenta de inmediato haciendo clic aquí:</p>
    <a className="btn-verify-secondary" href={url}>Activar mi cuenta</a>
  </div>;
}

export default function VerificationResend({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [url, setUrl] = useState<string | null>();

  async function resend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    setMessage('');
    setUrl(null);
    try {
      const result = await authService.resendVerification(email);
      setMessage(result.message);
      setUrl(result.verificationUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo reenviar el enlace. Intenta nuevamente.');
    } finally { setSending(false); }
  }

  return <div>
    <form className="verify-resend-form" onSubmit={resend}>
      <label>Correo electrónico
        <input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="ejemplo@correo.com" />
      </label>
      <button className="btn-verify-primary" disabled={sending} type="submit">
        {sending ? 'Enviando enlace…' : 'Reenviar enlace de verificación'}
      </button>
    </form>
    {error && <p className="verify-alert" role="alert">{error}</p>}
    {message && <p className="verify-alert" role="status">{message}</p>}
    <VerificationLocalLink url={url} />
  </div>;
}
