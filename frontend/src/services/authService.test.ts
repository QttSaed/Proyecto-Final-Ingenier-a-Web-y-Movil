import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './authService';

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
