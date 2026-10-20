import { apiRequest, ApiError } from './apiService';
import { useSyncExternalStore } from 'react';

export type Role = 'client' | 'admin';
export interface User { email: string; name: string; role: Role }
interface Account extends User { salt: string; hash: string }
const sessionKey = 'tcg.session';
const accountsKey = 'tcg.accounts';
const listeners = new Set<() => void>();
function readSession(): User | null {
  try {
    const user = JSON.parse(localStorage.getItem(sessionKey) || 'null');
    return user && typeof user.email === 'string' && typeof user.name === 'string' &&
      (user.role === 'client' || user.role === 'admin') ? user : null;
  } catch { return null; }
}
let session = readSession();
function notify() { listeners.forEach(listener => listener()); }
window.addEventListener('storage', () => { session = readSession(); notify(); });
async function digest(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 210000, hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
}
function accounts(): Account[] {
  try {
    const stored = JSON.parse(localStorage.getItem(accountsKey) || '[]');
    return Array.isArray(stored) ? stored.filter(a => a && typeof a.email === 'string' && typeof a.name === 'string' && typeof a.salt === 'string' && typeof a.hash === 'string') : [];
  } catch { return []; }
}
export const authService = {
  getUser: () => session,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  async login(email: string, password: string): Promise<User> {
    const normalized = email.trim().toLowerCase();
    try {
      const result = await apiRequest<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email: normalized, password }) });
      localStorage.setItem('tcg.token', result.token);
      localStorage.setItem(sessionKey, JSON.stringify(result.user));
      session = result.user; notify(); return result.user;
    } catch (error) { if (error instanceof ApiError) throw error; }
    localStorage.removeItem('tcg.token');
    const demo = [
      { email: 'admin@tcgstore.com', name: 'Administrador', role: 'admin' as const },
      { email: 'cliente@tcgstore.com', name: 'Juan Pérez', role: 'client' as const }
    ].find(user => user.email === normalized && password === '123456');
    const account = accounts().find(user => user.email === normalized);
    let user: User | null = demo || null;
    if (!user && account && await digest(password, account.salt) === account.hash) {
      user = { email: account.email, name: account.name, role: 'client' };
    }
    if (!user) throw new Error('Correo o contraseña incorrectos');
    localStorage.setItem(sessionKey, JSON.stringify(user));
    session = user; notify(); return user;
  },
  async register(name: string, email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) throw new Error('Revisa los datos y las condiciones de contraseña.');
    try {
      await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email: normalized, password }) });
      return;
    } catch (error) { if (error instanceof ApiError) throw error; }
    const stored = accounts();
    if (stored.some(user => user.email === normalized) || ['admin@tcgstore.com', 'cliente@tcgstore.com'].includes(normalized)) throw new Error('No se pudo registrar este correo. Usa otro o inicia sesión.');
    const salt = crypto.randomUUID();
    stored.push({ name: name.trim(), email: normalized, role: 'client', salt, hash: await digest(password, salt) });
    localStorage.setItem(accountsKey, JSON.stringify(stored));
  },
  logout() {
    localStorage.removeItem('tcg.token');
    localStorage.removeItem(sessionKey);
    ['isLoggedIn', 'role', 'userName', 'userEmail'].forEach(key => localStorage.removeItem(key));
    session = null; notify();
  }
};
export function useAuth() { return useSyncExternalStore(authService.subscribe, authService.getUser, () => null); }
