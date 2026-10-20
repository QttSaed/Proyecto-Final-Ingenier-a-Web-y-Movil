import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, apiService, localProducts } from './apiService';
import { localOrderService } from './localOrderService';

beforeEach(() => { localStorage.clear(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('cliente REST', () => {
  it('crea y consulta órdenes con el token del cliente', async () => {
    const order = { id: 'TCG-1', orderNumber: 'TCG-1', total: 13500 };
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => order });
    vi.stubGlobal('fetch', fetch);
    localStorage.setItem('tcg.token', 'client-token');
    const input = { items: [{ code: 'carta-1', quantity: 2 }], shippingName: 'Cliente',
      shippingEmail: 'cliente@example.com', shippingAddress: 'Calle 123', shippingCity: 'Santiago',
      shippingRegion: 'Metropolitana', paymentMethod: 'transfer' };
    expect(await apiService.createOrder(input)).toEqual(order);
    expect(fetch.mock.calls[0][0]).toMatch(/\/orders$/);
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'POST', headers: { Authorization: 'Bearer client-token' } });
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(input);
    fetch.mockResolvedValue({ ok: true, json: async () => [order] });
    expect(await apiService.orders()).toEqual([order]);
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer client-token');
  });

  it('propaga los rechazos y fallos de conexión de órdenes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Stock insuficiente' }) }));
    await expect(apiService.orders()).rejects.toThrow('Stock insuficiente');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiService.orders()).rejects.toThrow('Failed to fetch');
  });

  it('conserva el respaldo local separado para cada cliente', () => {
    const order = { id: 'LOCAL-1', customer: 'Cliente', total: 13500, date: new Date().toISOString(),
      status: 'Pendiente' as const, items: [{ title: 'Carta', quantity: 2, unitPrice: 5000 }] };
    localOrderService.save('cliente@example.com', order);
    expect(localOrderService.orders('CLIENTE@example.com')).toEqual([order]);
    expect(localOrderService.orders('otro@example.com')).toEqual([]);
    localStorage.setItem('tcg.orders.cliente@example.com', '{');
    expect(localOrderService.orders('cliente@example.com')).toEqual([]);
  });

  it('envía el JWT y guarda los atributos de un producto', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'nuevo', title: 'Carta' }) });
    vi.stubGlobal('fetch', fetch);
    localStorage.setItem('tcg.token', 'admin-token');
    await apiService.saveProduct({ title: 'Carta', price: 15000, stock: 3 });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/products$/);
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer admin-token');
    expect(JSON.parse(options.body)).toEqual({ title: 'Carta', price: 15000, stock: 3 });
  });

  it('busca en el catálogo local cuando el backend está desconectado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const query = localProducts[0].title;
    const result = await apiService.products(query);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(product => product.title.toLowerCase().includes(query.toLowerCase()))).toBe(true);
    expect((await apiService.stats()).totalProducts).toBe(localProducts.length);
  });

  it('conserva errores de autorización y no simula escrituras sin conexión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Acceso denegado' }) }));
    await expect(apiService.stats()).rejects.toThrow('Acceso denegado');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiService.saveProduct({ title: 'Carta' })).rejects.toThrow();
  });

  it('actualiza el estado del pedido mediante PATCH', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'TCG-1', status: 'Enviado' }) });
    vi.stubGlobal('fetch', fetch);
    await apiService.setOrderStatus('TCG-1', 'Enviado');
    expect(fetch.mock.calls[0][0]).toMatch(/\/orders\/TCG-1\/status$/);
    expect(fetch.mock.calls[0][1].method).toBe('PATCH');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ status: 'Enviado' });
    await apiRequest('/health');
  });
});
