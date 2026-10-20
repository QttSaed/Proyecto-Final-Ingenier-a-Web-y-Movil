import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { authService } from '../services/authService';
function LoginDestination() { const location = useLocation(); return <div>login:{location.state?.from}</div>; }
function renderRoute() {
  return render(<MemoryRouter initialEntries={['/checkout']}><Routes>
    <Route path="/checkout" element={<ProtectedRoute allowedRoles={['client']}><div>checkout</div></ProtectedRoute>} />
    <Route path="/login" element={<LoginDestination />} />
    <Route path="/admin" element={<div>admin</div>} />
  </Routes></MemoryRouter>);
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); authService.logout(); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('política de acceso', () => {
  it('conserva el destino del visitante anónimo', async () => {
    renderRoute();
    expect(await screen.findByText('login:/checkout')).toBeDefined();
  });
  it('redirige administradores que intentan comprar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ token: 'test-token', user: { email: 'admin@tcgstore.com', name: 'Usuario', role: 'admin' } }) }));
    await authService.login('admin@tcgstore.com', '123456');
    renderRoute();
    expect(await screen.findByText('admin')).toBeDefined();
  });
  it('redirige una sola vez al cerrar la sesión del cliente', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ token: 'test-token', user: { email: 'cliente@tcgstore.com', name: 'Usuario', role: 'client' } }) }));
    await authService.login('cliente@tcgstore.com', '123456');
    renderRoute();
    expect(screen.getByText('checkout')).toBeDefined();
    expect(sessionStorage.getItem('tcg.token')).toBe('test-token');
    act(() => authService.logout());
    expect(sessionStorage.getItem('tcg.token')).toBeNull();
    expect(sessionStorage.getItem('tcg.session')).toBeNull();
    await waitFor(() => expect(screen.getByText('login:/checkout')).toBeDefined());
    expect(screen.queryByText('checkout')).toBeNull();
  });
});
