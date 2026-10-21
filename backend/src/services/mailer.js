const nodemailer = require('nodemailer');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

exports.sendVerificationEmail = async ({ email, name, token, clientUrl }) => {
  const verificationUrl = `${clientUrl.replace(/\/$/, '')}/verificar-correo?token=${encodeURIComponent(token)}`;
  const configured = (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) || (process.env.SMTP_USER && process.env.SMTP_PASS);
  if (!configured) {
    console.log(`[TCGStore Mailer] Modo local: Enlace de verificación para ${email}: ${verificationUrl}`);
    return { sent: false, mock: true, verificationUrl };
  }

  const account = process.env.GMAIL_USER || process.env.SMTP_USER;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: account, pass: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS }
  });
  await transport.sendMail({
    from: { name: 'TCGStore', address: account },
    to: email,
    subject: 'Verifica tu cuenta en TCGStore',
    text: `Hola ${name}, verifica tu cuenta en TCGStore: ${verificationUrl}\nEl enlace expira en 24 horas.`,
    html: `<div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:32px"><div style="max-width:560px;margin:auto;background:white;padding:32px;border-radius:12px"><h1 style="color:#6d28d9">TCGStore</h1><h2>Hola ${escapeHtml(name)},</h2><p>Bienvenido a TCGStore. Verifica tu correo electrónico para activar tu cuenta.</p><p style="margin:32px 0"><a href="${escapeHtml(verificationUrl)}" style="background:#6d28d9;color:white;padding:14px 24px;border-radius:6px;text-decoration:none">Verificar mi cuenta</a></p><p>Este enlace expira en 24 horas.</p><p>Si no creaste esta cuenta, puedes ignorar este correo.</p></div></div>`
  });
  return { sent: true, provider: 'gmail' };
};
