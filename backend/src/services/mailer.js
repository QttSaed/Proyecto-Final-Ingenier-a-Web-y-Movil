const nodemailer = require('nodemailer');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

async function sendMail({ email, subject, text, html }) {
  const account = process.env.GMAIL_USER || process.env.SMTP_USER;
  const password = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  if (account && password) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: account, pass: password }
    });
    await transport.sendMail({
      from: { name: 'TCGStore', address: account },
      to: email,
      subject,
      text,
      html
    });
    return { sent: true, provider: 'gmail' };
  }

  return { sent: false, mock: true };
}

exports.sendVerificationEmail = async ({ email, name, token, clientUrl }) => {
  const verificationUrl = `${clientUrl.replace(/\/$/, '')}/verificar-correo?token=${encodeURIComponent(token)}`;
  const subject = 'Verifica tu cuenta en TCGStore';
  const text = `Hola ${name},\n\nBienvenido a TCGStore. Verifica tu correo electrónico ingresando al siguiente enlace:\n${verificationUrl}\n\nEste enlace expira en 24 horas.\nSi no creaste esta cuenta, puedes ignorar este mensaje.`;
  const html = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;padding:32px 16px;color:#1e293b;">
      <div style="max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <div style="background:#1b1642;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;font-weight:800;">TCGStore</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1e293b;font-size:20px;margin-top:0;">¡Hola ${escapeHtml(name)}!</h2>
          <p style="font-size:15px;line-height:1.6;color:#475569;">
            Gracias por registrarte en TCGStore. Para activar tu cuenta y comenzar a comprar tus cartas favoritas, confirma tu correo electrónico:
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${escapeHtml(verificationUrl)}" style="background:#4f46e5;color:#ffffff;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;display:inline-block;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="font-size:13px;line-height:1.5;color:#64748b;">
            O copia y pega este enlace en tu navegador:<br />
            <a href="${escapeHtml(verificationUrl)}" style="color:#4f46e5;word-break:break-all;">${escapeHtml(verificationUrl)}</a>
          </p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="font-size:12px;color:#94a3b8;margin:0;">
            Este enlace expira en 24 horas. Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.
          </p>
        </div>
      </div>
    </div>
  `;

  const result = await sendMail({ email, subject, text, html });
  if (result.mock) {
    console.log(`[TCGStore Mailer] Modo local: Enlace de verificación para ${email}: ${verificationUrl}`);
    return { sent: false, mock: true, verificationUrl };
  }
  return result;
};

exports.sendPasswordResetEmail = async ({ email, name, token, clientUrl }) => {
  const resetUrl = `${clientUrl.replace(/\/$/, '')}/restablecer-contrasena?token=${encodeURIComponent(token)}`;
  const subject = 'Restablece tu contraseña en TCGStore';
  const text = `Hola ${name},\n\nHemos recibido una solicitud para restablecer tu contraseña en TCGStore. Ingresa al siguiente enlace para crear una nueva contraseña:\n${resetUrl}\n\nEste enlace expira en 1 hora.\nSi no solicitaste este cambio, puedes ignorar este mensaje; tu contraseña actual no será modificada.`;
  const html = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;padding:32px 16px;color:#1e293b;">
      <div style="max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <div style="background:#1b1642;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;font-weight:800;">TCGStore</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1e293b;font-size:20px;margin-top:0;">Recuperación de contraseña</h2>
          <p style="font-size:15px;line-height:1.6;color:#475569;">
            Hola ${escapeHtml(name)}, recibimos una solicitud para restablecer la contraseña de tu cuenta en TCGStore. Haz clic en el botón de abajo para definir una nueva clave:
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${escapeHtml(resetUrl)}" style="background:#4f46e5;color:#ffffff;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;display:inline-block;">
              Restablecer mi contraseña
            </a>
          </div>
          <p style="font-size:13px;line-height:1.5;color:#64748b;">
            O copia y pega este enlace en tu navegador:<br />
            <a href="${escapeHtml(resetUrl)}" style="color:#4f46e5;word-break:break-all;">${escapeHtml(resetUrl)}</a>
          </p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="font-size:12px;color:#94a3b8;margin:0;">
            Por seguridad, este enlace es válido por 1 hora. Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu cuenta permanece protegida.
          </p>
        </div>
      </div>
    </div>
  `;

  const result = await sendMail({ email, subject, text, html });
  if (result.mock) {
    console.log(`[TCGStore Mailer] Modo local: Enlace de restablecimiento para ${email}: ${resetUrl}`);
    return { sent: false, mock: true, resetUrl };
  }
  return result;
};
