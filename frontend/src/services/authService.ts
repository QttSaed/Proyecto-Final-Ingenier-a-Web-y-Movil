import { apiRequest, ApiError } from './apiService';
import { useSyncExternalStore } from 'react';

export type Role = 'client' | 'admin';
export interface User {
  id?: number | string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  avatarUrl?: string | null;
  isVerified?: boolean;
}
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
  async getProfile(): Promise<User> {
    try {
      const user = await apiRequest<User>('/auth/me');
      sessionStorage.setItem(sessionKey, JSON.stringify(user));
      session = user;
      notify();
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      return session || { email: '', name: '', role: 'client' };
    }
  },
  async updateProfile(data: Partial<Pick<User, 'name' | 'phone' | 'address' | 'city' | 'region'>>): Promise<User> {
    try {
      const updated = await apiRequest<User>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      sessionStorage.setItem(sessionKey, JSON.stringify(updated));
      session = updated;
      notify();
      return updated;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('No se pudo actualizar el perfil. Intenta nuevamente.');
    }
  },
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
  async loginWithGoogle(credential: string): Promise<User> {
    try {
      const result = await apiRequest<{ message: string; user: User; token: string }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken: credential })
      });
      sessionStorage.setItem('tcg.token', result.token);
      sessionStorage.setItem(sessionKey, JSON.stringify(result.user));
      session = result.user;
      notify();
      return result.user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('No se pudo autenticar con Google. Intenta nuevamente.');
    }
  },
  async register(name: string, email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) throw new Error('Revisa los datos y las condiciones de contraseña.');
    try {
      const result = await apiRequest<{ message: string; requiresVerification?: boolean; email?: string; verificationUrl?: string | null }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email: normalized, password }) });
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error('No se pudo conectar con el servidor');
    }
  },
  async verifyEmail(token: string): Promise<{ message: string; user: User }> {
    const result = await apiRequest<{ message: string; user: User; token: string }>('/auth/verify-email', {
      method: 'POST', body: JSON.stringify({ token })
    });
    sessionStorage.setItem('tcg.token', result.token);
    sessionStorage.setItem(sessionKey, JSON.stringify(result.user));
    session = result.user;
    notify();
    return { message: result.message, user: result.user };
  },
  async resendVerification(email: string): Promise<{ message: string; verificationUrl?: string | null }> {
    return apiRequest('/auth/resend-verification', {
      method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase() })
    });
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
