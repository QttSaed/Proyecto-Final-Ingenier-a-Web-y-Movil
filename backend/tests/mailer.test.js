const { test } = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');
const { sendVerificationEmail } = require('../src/services/mailer');

function setEnv(t, key, value) {
  const previous = process.env[key];
  process.env[key] = value;
  t.after(() => {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  });
}

test('mailer devuelve el enlace local sin credenciales', async t => {
  setEnv(t, 'GMAIL_USER', '');
  setEnv(t, 'GMAIL_APP_PASSWORD', '');
  setEnv(t, 'SMTP_USER', '');
  setEnv(t, 'SMTP_PASS', '');
  const log = t.mock.method(console, 'log', () => {});
  const transport = t.mock.method(nodemailer, 'createTransport', () => { throw new Error('Unexpected transport'); });
  const result = await sendVerificationEmail({ email: 'test@example.com', name: 'Cliente', token: 'abc', clientUrl: 'http://localhost:5173/' });
  assert.deepEqual(result, { sent: false, mock: true, verificationUrl: 'http://localhost:5173/verificar-correo?token=abc' });
  assert.match(log.mock.calls[0].arguments[0], /test@example.com/);
  assert.equal(transport.mock.callCount(), 0);
});

test('mailer usa Gmail con credenciales Gmail o SMTP y escapa el nombre', async t => {
  for (const provider of ['gmail', 'smtp']) {
    await t.test(provider, async t => {
      setEnv(t, 'GMAIL_USER', provider === 'gmail' ? 'sender@gmail.com' : '');
      setEnv(t, 'GMAIL_APP_PASSWORD', provider === 'gmail' ? 'app-password' : '');
      setEnv(t, 'SMTP_USER', provider === 'smtp' ? 'sender@gmail.com' : '');
      setEnv(t, 'SMTP_PASS', provider === 'smtp' ? 'app-password' : '');
      let message;
      const transport = t.mock.method(nodemailer, 'createTransport', options => {
        assert.deepEqual(options, { service: 'gmail', auth: { user: 'sender@gmail.com', pass: 'app-password' } });
        return { async sendMail(mail) { message = mail; } };
      });
      const result = await sendVerificationEmail({ email: 'test@example.com', name: '<Cliente>', token: 'abc', clientUrl: 'https://tcgstore.example' });
      assert.deepEqual(result, { sent: true, provider: 'gmail' });
      assert.equal(transport.mock.callCount(), 1);
      assert.equal(message.subject, 'Verifica tu cuenta en TCGStore');
      assert.equal(message.to, 'test@example.com');
      assert.match(message.html, /&lt;Cliente&gt;/);
      assert.match(message.html, /https:\/\/tcgstore.example\/verificar-correo\?token=abc/);
      assert.match(message.html, /24 horas/);
    });
  }
});
