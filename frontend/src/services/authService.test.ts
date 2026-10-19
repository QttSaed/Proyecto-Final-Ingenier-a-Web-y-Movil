import { beforeEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { authService } from './authService';

beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto);
  localStorage.clear();
  authService.logout();
});
describe('autenticación local', () => {
  it('rechaza credenciales con un mensaje que no revela cuentas de prueba', async () => {
    await expect(authService.login('incorrecto@example.cl', 'incorrecta')).rejects.toThrow('Correo o contraseña incorrectos');
    expect(authService.getUser()).toBeNull();
  });
  it('registra un cliente, almacena un hash y permite volver a iniciar sesión', async () => {
    await authService.register('Nueva Cliente', 'NUEVA@example.cl', 'Segura123');
    expect(localStorage.getItem('tcg.accounts')).not.toContain('Segura123');
    expect(await authService.login('nueva@example.cl', 'Segura123')).toEqual({ name: 'Nueva Cliente', email: 'nueva@example.cl', role: 'client' });
    authService.logout();
    expect(authService.getUser()).toBeNull();
    expect(localStorage.getItem('tcg.session')).toBeNull();
    expect((await authService.login('nueva@example.cl', 'Segura123')).role).toBe('client');
  });
  it('rechaza contraseñas débiles y registros duplicados', async () => {
    await expect(authService.register('Cliente', 'nuevo@example.cl', 'soloLetras')).rejects.toThrow();
    await authService.register('Cliente', 'nuevo@example.cl', 'Segura123');
    await expect(authService.register('Otro', 'nuevo@example.cl', 'Segura123')).rejects.toThrow();
  });
  it('nunca concede el rol almacenado en una cuenta registrada', async () => {
    await authService.register('Cliente', 'nuevo@example.cl', 'Segura123');
    const stored = JSON.parse(localStorage.getItem('tcg.accounts')!);
    stored[0].role = 'admin';
    localStorage.setItem('tcg.accounts', JSON.stringify(stored));
    expect((await authService.login('nuevo@example.cl', 'Segura123')).role).toBe('client');
  });
});
