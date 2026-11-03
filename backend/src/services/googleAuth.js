const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

async function verifyGoogleIdToken(idToken) {
  let payload;
  if (process.env.GOOGLE_CLIENT_ID) {
    const ticket = await new OAuth2Client(process.env.GOOGLE_CLIENT_ID).verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    payload = ticket.getPayload();
  } else {
    try {
      payload = jwt.decode(idToken) || JSON.parse(idToken);
    } catch {
      throw new Error('Token de Google inválido');
    }
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
      typeof payload.email !== 'string' || !payload.email.trim()) {
    throw new Error('Token de Google inválido');
  }
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null,
    emailVerified: payload.email_verified
  };
}

module.exports = { verifyGoogleIdToken };
