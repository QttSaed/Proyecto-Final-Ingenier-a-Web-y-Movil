import data from '../data.json';
import { OrderStatus } from './orderService';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); }
}
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('tcg.token');
  const response = await fetch(`${API_URL}${path}`, { ...options, signal: options.signal ?? AbortSignal.timeout(8000), headers: {
    'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers
  } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.message || 'No se pudo completar la operación', response.status);
  if (body === null) throw new ApiError('La respuesta del servidor no es válida');
  return body;
}
export interface Product {
  id: string; title: string; category: string; categorySlug?: string; game: string; edition: string;
  rarity: string; color: string; cost: number; cardType: string; condition: string;
  price: number; stock: number; image: string; hasButton?: boolean; description?: string;
}
export interface Order {
  adminNotes?: string | null;
  id: string; orderNumber?: string; customer: string; total: number; date: string; status: OrderStatus;
  items: { title: string; quantity: number; unitPrice: number }[];
}
export interface CreateOrderData {
  items: { code: string; quantity: number }[];
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingRegion: string;
  paymentMethod: string;
}
export interface Stats { totalSales: number; totalOrders: number; totalProducts: number; totalStock: number; totalClients: number; recentOrders: Order[]; offline?: boolean }
export const money = (value: number) => '$' + Number(value).toLocaleString('es-CL');
export const localProducts: Product[] = Object.entries(data.sections).flatMap(([section, products]) => products.map(p => ({ ...p,
  categorySlug: section.toLowerCase(), price: Number(p.price.replace(/[^0-9]/g, '')), stock: 5
})));
export interface Category { name: string; slug: string }
export const apiService = {
  async products(search = ''): Promise<Product[]> {
    try { return await apiRequest<Product[]>(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`); }
    catch (error) { if (error instanceof ApiError) throw error; return localProducts.filter(p => p.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())); }
  },
  async categories(): Promise<Category[]> {
    try { return await apiRequest<Category[]>('/categories'); }
    catch (error) { if (error instanceof ApiError) throw error; return Object.keys(data.sections).map(name => ({ name, slug: name.toLowerCase().replace(/\s/g, '') })); }
  },
  async orders(): Promise<Order[]> {
    return apiRequest<Order[]>('/orders');
  },
  createOrder: (orderData: CreateOrderData) => apiRequest<Order>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  async stats(): Promise<Stats> {
    try { return await apiRequest<Stats>('/admin/stats'); }
    catch (error) { if (error instanceof ApiError) throw error; return { totalSales: 0, totalOrders: 0, totalProducts: localProducts.length, totalStock: localProducts.reduce((sum, p) => sum + p.stock, 0), totalClients: 0, recentOrders: [], offline: true }; }
  },
  saveProduct: (product: Partial<Product>, id?: string) => apiRequest<Product>(`/products${id ? `/${encodeURIComponent(id)}` : ''}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(product) }),
  deleteProduct: (id: string) => apiRequest(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  setOrderStatus: (id: string, status: OrderStatus, adminNotes?: string | null) => apiRequest<Order>(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) }) })
};
