import type { Order } from './apiService';

const storageKey = (email: string) => `tcg.orders.${email.trim().toLowerCase()}`;

export const localOrderService = {
  orders(email: string): Order[] {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey(email)) || '[]');
      return Array.isArray(stored) ? stored.filter(order => order && typeof order.id === 'string' &&
        typeof order.total === 'number' && typeof order.date === 'string' && Array.isArray(order.items)) : [];
    } catch { return []; }
  },
  save(email: string, order: Order) {
    localStorage.setItem(storageKey(email), JSON.stringify([order, ...this.orders(email)]));
  }
};
