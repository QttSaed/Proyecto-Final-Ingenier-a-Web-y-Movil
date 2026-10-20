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
});
