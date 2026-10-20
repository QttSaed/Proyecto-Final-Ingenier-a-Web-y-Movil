import { apiRequest, ApiError } from './apiService';
import { useSyncExternalStore } from 'react';

export type Role = 'client' | 'admin';
export interface User { email: string; name: string; role: Role }
const sessionKey = 'tcg.session';
const listeners = new Set<() => void>();
function readSession(): User | null {
  try {
    const user = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
    return user && typeof user.email === 'string' && typeof user.name === 'string' &&
      (user.role === 'client' || user.role === 'admin') ? user : null;
  } catch { return null; }
}
let session = readSession();
function notify() { listeners.forEach(listener => listener()); }
window.addEventListener('storage', () => { session = readSession(); notify(); });
export const authService = {
  getUser: () => session,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  async login(email: string, password: string): Promise<User> {
    const normalized = email.trim().toLowerCase();
    try {
      const result = await apiRequest<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email: normalized, password }) });
      sessionStorage.setItem('tcg.token', result.token);
      sessionStorage.setItem(sessionKey, JSON.stringify(result.user));
      session = result.user; notify(); return result.user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('No se pudo conectar con el servidor');
    }
  },
  async register(name: string, email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) throw new Error('Revisa los datos y las condiciones de contraseña.');
    try {
      await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email: normalized, password }) });
      return;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('No se pudo conectar con el servidor');
    }
  },
  logout() {
    ['tcg.token', sessionKey, 'isLoggedIn', 'role', 'userName', 'userEmail'].forEach(key => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
    session = null; notify();
  }
};
export function useAuth() { return useSyncExternalStore(authService.subscribe, authService.getUser, () => null); }
