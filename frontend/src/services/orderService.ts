export const ORDER_STATUSES = ['Pendiente', 'Pagado', 'Enviado', 'Entregado'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
