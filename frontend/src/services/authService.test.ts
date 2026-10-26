import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './authService';
import { ApiError } from './apiService';

const fetchMock = vi.fn();
const user = { name: 'Cliente', email: 'cliente@example.cl', role: 'client' };
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  authService.logout();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('autenticación REST', () => {
  it('refreshes profile data, stores it and notifies subscribers', async () => {
    const profile = { ...user, id: 7, phone: '+56 9 8765 4321', address: 'Los Robles 12', city: 'Santiago', region: 'Metropolitana', avatarUrl: '/avatar.jpg', isVerified: true };
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);
    sessionStorage.setItem('tcg.token', 'profile-token');
    fetchMock.mockResolvedValue({ ok: true, json: async () => profile });
    try {
      expect(await authService.getProfile()).toEqual(profile);
      expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/me$/), expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer profile-token' })
      }));
      expect(authService.getUser()).toEqual(profile);
      expect(JSON.parse(sessionStorage.getItem('tcg.session')!)).toEqual(profile);
      expect(listener).toHaveBeenCalledTimes(1);
    } finally { unsubscribe(); }
  });

  it('uses the current session for profile network failures and an empty user without a session', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    expect(await authService.getProfile()).toEqual({ email: '', name: '', role: 'client' });
    expect(authService.getUser()).toBeNull();
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ user, token: 'token' }) });
    await authService.login(user.email, 'Segura123');
    expect(await authService.getProfile()).toEqual(user);
    expect(authService.getUser()).toEqual(user);
  });

  it('propagates profile API errors', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'Sesión vencida' }) });
    await expect(authService.getProfile()).rejects.toMatchObject({ message: 'Sesión vencida', status: 401 });
    expect(authService.getUser()).toBeNull();
  });

  it('saves contact and shipping changes and publishes the returned profile', async () => {
    const changes = { name: 'Cliente actualizado', phone: null, address: 'Los Robles 12', city: 'Santiago', region: 'Metropolitana' };
    const updated = { ...user, ...changes };
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);
    fetchMock.mockResolvedValue({ ok: true, json: async () => updated });
    try {
      expect(await authService.updateProfile(changes)).toEqual(updated);
      expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/me$/), expect.objectContaining({
        method: 'PUT', body: JSON.stringify(changes)
      }));
      expect(authService.getUser()).toEqual(updated);
      expect(JSON.parse(sessionStorage.getItem('tcg.session')!)).toEqual(updated);
      expect(listener).toHaveBeenCalledTimes(1);
    } finally { unsubscribe(); }
  });

  it('preserves the session when profile updates fail', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ user, token: 'token' }) });
    await authService.login(user.email, 'Segura123');
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);
    try {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ message: 'Teléfono inválido' }) });
      await expect(authService.updateProfile({ phone: 'invalid' })).rejects.toBeInstanceOf(ApiError);
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
      await expect(authService.updateProfile({ name: 'Nuevo' })).rejects.toThrow('No se pudo actualizar el perfil. Intenta nuevamente.');
      expect(authService.getUser()).toEqual(user);
      expect(JSON.parse(sessionStorage.getItem('tcg.session')!)).toEqual(user);
      expect(listener).not.toHaveBeenCalled();
    } finally { unsubscribe(); }
  });

  it('stores the Google login token and session and notifies subscribers', async () => {
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ message: 'Sesión iniciada', user, token: 'google-token' }) });
    try {
      expect(await authService.loginWithGoogle('google-credential')).toEqual(user);
      expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/google$/), expect.objectContaining({
        method: 'POST', body: JSON.stringify({ idToken: 'google-credential' })
      }));
      expect(sessionStorage.getItem('tcg.token')).toBe('google-token');
      expect(JSON.parse(sessionStorage.getItem('tcg.session')!)).toEqual(user);
      expect(authService.getUser()).toEqual(user);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('tcg.token')).toBeNull();
      expect(localStorage.getItem('tcg.session')).toBeNull();
    } finally { unsubscribe(); }
  });
  it('propagates Google login backend errors without starting a session', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'Credencial de Google inválida' }) });
    await expect(authService.loginWithGoogle('invalid')).rejects.toMatchObject({
      message: 'Credencial de Google inválida', status: 401
    });
    await expect(authService.loginWithGoogle('invalid')).rejects.toBeInstanceOf(ApiError);
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
    expect(sessionStorage.getItem('tcg.session')).toBeNull();
  });
  it('reports Google login network failures without starting a session', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(authService.loginWithGoogle('google-credential')).rejects.toThrow('No se pudo autenticar con Google. Intenta nuevamente.');
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
    expect(sessionStorage.getItem('tcg.session')).toBeNull();
  });
  it('propaga los rechazos del backend sin iniciar sesión', async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ message: 'Credenciales incorrectas' }) });
    await expect(authService.login('admin@tcgstore.com', '123456')).rejects.toThrow('Credenciales incorrectas');
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
  });
  it('envía credenciales normalizadas y conserva el token y la sesión hasta cerrarla', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ user, token: 'api-token' }) });
    expect(await authService.login(' CLIENTE@EXAMPLE.CL ', 'Segura123')).toEqual(user);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/login$/), expect.objectContaining({
      method: 'POST', body: JSON.stringify({ email: user.email, password: 'Segura123' })
    }));
    expect(authService.getUser()).toEqual(user);
    expect(localStorage.getItem('tcg.token')).toBeNull();
    expect(localStorage.getItem('tcg.session')).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBe('api-token');
    expect(JSON.parse(sessionStorage.getItem('tcg.session')!)).toEqual(user);
    localStorage.setItem('tcg.token', 'old-token');
    localStorage.setItem('tcg.session', JSON.stringify(user));
    authService.logout();
    expect(localStorage.getItem('tcg.token')).toBeNull();
    expect(localStorage.getItem('tcg.session')).toBeNull();
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.session')).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
  });
  it('valida el registro, envía los datos a la API y propaga sus rechazos', async () => {
    for (const [name, email, password] of [
      [' ', user.email, 'Segura123'], ['Cliente', 'correo', 'Segura123'],
      ['Cliente', user.email, 'Abc1234'], ['Cliente', user.email, 'soloLetras'],
      ['Cliente', user.email, '12345678']
    ]) {
      await expect(authService.register(name, email, password)).rejects.toThrow('Revisa los datos');
    }
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ user }) });
    await authService.register('Cliente', ' CLIENTE@EXAMPLE.CL ', 'Segura123');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/register$/), expect.objectContaining({
      method: 'POST', body: JSON.stringify({ name: 'Cliente', email: user.email, password: 'Segura123' })
    }));
    expect(localStorage.getItem('tcg.accounts')).toBeNull();
    expect(authService.getUser()).toBeNull();
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ message: 'Correo duplicado' }) });
    await expect(authService.register('Cliente', user.email, 'Segura123')).rejects.toThrow('Correo duplicado');
  });
  it('rechaza fallos de red y respuestas inválidas sin recurrir a cuentas locales', async () => {
    localStorage.setItem('tcg.accounts', JSON.stringify([{ ...user, password: 'Segura123' }]));
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(authService.login('admin@tcgstore.com', '123456')).rejects.toThrow('No se pudo conectar con el servidor');
    await expect(authService.login(user.email, 'Segura123')).rejects.toThrow('No se pudo conectar con el servidor');
    await expect(authService.register('Cliente', user.email, 'Segura123')).rejects.toThrow('No se pudo conectar con el servidor');
    fetchMock.mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError(); } });
    await expect(authService.login(user.email, 'Segura123')).rejects.toThrow('La respuesta del servidor no es válida');
    await expect(authService.register('Cliente', user.email, 'Segura123')).rejects.toThrow('La respuesta del servidor no es válida');
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
  });
  it('returns registration verification details without starting a session', async () => {
    const result = { message: 'Cuenta creada', requiresVerification: true, email: user.email, verificationUrl: '/verificar-correo?token=local' };
    fetchMock.mockResolvedValue({ ok: true, json: async () => result });
    expect(await authService.register(user.name, user.email, 'Segura123')).toEqual(result);
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
  });
  it('verifies the token, stores the session and notifies subscribers', async () => {
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ message: 'Correo verificado', user, token: 'verified-token' }) });
    try {
      expect(await authService.verifyEmail('email-token')).toEqual({ message: 'Correo verificado', user });
      expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/verify-email$/), expect.objectContaining({ method: 'POST', body: JSON.stringify({ token: 'email-token' }) }));
      expect(sessionStorage.getItem('tcg.token')).toBe('verified-token');
      expect(JSON.parse(sessionStorage.getItem('tcg.session')!)).toEqual(user);
      expect(authService.getUser()).toEqual(user);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('tcg.token')).toBeNull();
    } finally { unsubscribe(); }
  });
  it('rejects invalid verification tokens without creating a session', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400, json: async () => ({ message: 'Enlace vencido' }) });
    await expect(authService.verifyEmail('expired')).rejects.toThrow('Enlace vencido');
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
    expect(sessionStorage.getItem('tcg.session')).toBeNull();
  });
  it('resends verification to the normalized email and returns the local link', async () => {
    const result = { message: 'Enlace enviado', verificationUrl: '/verificar-correo?token=new' };
    fetchMock.mockResolvedValue({ ok: true, json: async () => result });
    expect(await authService.resendVerification(' CLIENTE@EXAMPLE.CL ')).toEqual(result);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/auth\/resend-verification$/), expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: user.email }) }));
    expect(authService.getUser()).toBeNull();
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
  });
  it('propagates resend errors and accepts responses without a local link', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({ message: 'Intenta mas tarde' }) });
    await expect(authService.resendVerification(user.email)).rejects.toThrow('Intenta mas tarde');
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Enlace enviado' }) });
    expect(await authService.resendVerification(user.email)).toEqual({ message: 'Enlace enviado' });
  });

});
