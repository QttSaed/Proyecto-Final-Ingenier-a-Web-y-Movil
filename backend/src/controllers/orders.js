const { randomUUID } = require('node:crypto');
const v = require('../middlewares/validate');
const { HttpError } = require('../middlewares/errorHandler');
const { identifier, order } = require('../utils/records');
const select = 'SELECT o.*, u.name AS client_name, u.email AS client_email FROM orders o JOIN users u ON u.id = o.user_id';
async function withItems(db, row) {
  const { rows } = await db.query('SELECT oi.*, p.code, p.title, p.image_url FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = $1 ORDER BY oi.id', [row.id]);
  return order(row, rows.map(i => ({ id: i.id, productId: i.code, dbId: i.product_id, code: i.code, title: i.title, image: i.image_url, quantity: i.quantity, unitPrice: i.unit_price, price: i.unit_price, total: i.quantity * i.unit_price })));
}
async function find(db, id) {
  const where = identifier(id, 'o', 'order_number');
  return (await db.query(`${select} WHERE ${where.sql} ORDER BY (o.order_number = $1) DESC LIMIT 1`, where.params)).rows[0];
}
exports.create = async (req, res) => {
  const input = req.body;
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > 100) v.fail('items debe ser un array con entre 1 y 100 productos');
  const requested = input.items.map(item => {
    if (!item || typeof item !== 'object') v.fail('Cada item debe contener productId/code y quantity');
    const id = item.code ?? item.productId;
    if (!['string', 'number'].includes(typeof id)) v.fail('productId/code es obligatorio');
    return { id: v.text(String(id), 'productId/code', 80), quantity: v.integer(item.quantity, 'quantity', 1) };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const shipping = [v.text(input.shippingName, 'shippingName', 150), v.email(input.shippingEmail, 'shippingEmail'),
    v.text(input.shippingAddress, 'shippingAddress'), v.text(input.shippingCity, 'shippingCity', 100),
    v.text(input.shippingRegion, 'shippingRegion', 100), v.text(input.paymentMethod, 'paymentMethod', 50)];
  const client = await req.app.locals.db.getClient();
  try {
    await client.query('BEGIN');
    const lines = new Map();
    for (const item of requested) {
      const where = identifier(item.id, 'p');
      const { rows } = await client.query(`SELECT p.* FROM products p WHERE ${where.sql} ORDER BY (p.code = $1) DESC LIMIT 1 FOR UPDATE`, where.params);
      const p = rows[0];
      if (!p || !p.is_active) throw new HttpError(404, 'Producto no encontrado');
      const quantity = (lines.get(p.id)?.quantity || 0) + item.quantity;
      if (quantity > p.stock) throw new HttpError(400, `Stock insuficiente para ${p.title}`);
      lines.set(p.id, { ...p, quantity });
    }
    const subtotal = [...lines.values()].reduce((sum, p) => sum + p.price * p.quantity, 0);
    const shippingCost = subtotal >= 50000 ? 0 : 3500;
    if (!Number.isSafeInteger(subtotal) || subtotal + shippingCost > 2147483647) v.fail('El total del pedido excede el monto permitido');
    const { rows } = await client.query(`INSERT INTO orders (order_number, user_id, status, subtotal, shipping_cost, total, shipping_name, shipping_email, shipping_address, shipping_city, shipping_region, payment_method) VALUES ($1, $2, 'Pendiente', $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [`TCG-${randomUUID()}`, req.user.id, subtotal, shippingCost, subtotal + shippingCost, ...shipping]);
    for (const p of lines.values()) {
      await client.query('UPDATE products SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [p.quantity, p.id]);
      await client.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)', [rows[0].id, p.id, p.quantity, p.price]);
    }
    const result = await withItems(client, rows[0]);
    await client.query('COMMIT');
    res.status(201).json(result);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally { client.release(); }
};
exports.list = async (req, res) => {
  const db = req.app.locals.db;
  const { rows } = await db.query(`${select}${req.user.role === 'admin' ? '' : ' WHERE o.user_id = $1'} ORDER BY o.created_at DESC`, req.user.role === 'admin' ? [] : [req.user.id]);
  res.json(await Promise.all(rows.map(row => withItems(db, row))));
};
exports.detail = async (req, res) => {
  const row = await find(req.app.locals.db, req.params.id);
  if (!row) throw new HttpError(404, 'Pedido no encontrado');
  if (req.user.role !== 'admin' && String(row.user_id) !== String(req.user.id)) throw new HttpError(403, 'No tienes acceso a este pedido');
  res.json(await withItems(req.app.locals.db, row));
};
exports.status = async (req, res) => {
  const status = v.choice(req.body.status, 'status', ['Pendiente', 'Pagado', 'Enviado', 'Entregado']);
  const db = req.app.locals.db, existing = await find(db, req.params.id);
  if (!existing) throw new HttpError(404, 'Pedido no encontrado');
  const { rows } = await db.query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, existing.id]);
  res.json(await withItems(db, rows[0]));
};
