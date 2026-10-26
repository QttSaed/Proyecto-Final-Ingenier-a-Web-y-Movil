function identifier(value, alias, column = 'code') {
  return /^\d+$/.test(value)
    ? { sql: `(${alias}.${column} = $1 OR ${alias}.id::text = $1)`, params: [value] }
    : { sql: `${alias}.${column} = $1`, params: [value] };
}
const user = (row) => ({ ...Object.fromEntries(['id', 'name', 'email', 'role', 'phone', 'address', 'city', 'region'].map(key => [key, row[key] ?? null])), isVerified: Boolean(row.is_verified), avatarUrl: row.avatar_url ?? null });
const product = p => ({ id: p.code, dbId: p.id, code: p.code, title: p.title, description: p.description,
  price: p.price, priceFormatted: '$' + Number(p.price).toLocaleString('es-CL'), stock: p.stock,
  category: p.category, categorySlug: p.category_slug, game: p.game, edition: p.edition, rarity: p.rarity,
  color: p.color, cost: p.cost, cardType: p.card_type, condition: p.condition, image: p.image_url,
  hasButton: p.has_button, isActive: p.is_active });
const order = (o, items) => ({ id: o.order_number, dbId: o.id, orderNumber: o.order_number, status: o.status,
  adminNotes: o.admin_notes ?? null,
  subtotal: o.subtotal, shippingCost: o.shipping_cost, total: o.total, date: o.created_at,
  customer: o.shipping_name, email: o.shipping_email, shippingAddress: o.shipping_address,
  shippingCity: o.shipping_city, shippingRegion: o.shipping_region, paymentMethod: o.payment_method,
  userId: o.user_id, client: o.client_name ? { id: o.user_id, name: o.client_name, email: o.client_email } : undefined, items });
module.exports = { identifier, user, product, order };
