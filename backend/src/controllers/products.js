const { randomUUID } = require('node:crypto');
const v = require('../middlewares/validate');
const { HttpError } = require('../middlewares/errorHandler');
const { identifier, product } = require('../utils/records');
const select = 'SELECT p.*, c.name AS category, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id';
async function find(db, id) {
  const where = identifier(id, 'p');
  return (await db.query(`${select} WHERE ${where.sql} ORDER BY (p.code = $1) DESC LIMIT 1`, where.params)).rows[0];
}
exports.list = async (req, res) => {
  const params = [], clauses = [];
  if (req.query.includeInactive !== undefined) v.choice(req.query.includeInactive, 'includeInactive', ['true', 'false']);
  if (req.query.includeInactive !== 'true' || req.user?.role !== 'admin') clauses.push('p.is_active = true');
  for (const [key, column] of Object.entries({ game: 'game', edition: 'edition', rarity: 'rarity', color: 'color', cost: 'cost', cardType: 'card_type', condition: 'condition' })) {
    if (req.query[key] !== undefined) {
      params.push(key === 'cost' ? v.integer(req.query[key], key) : v.text(req.query[key], key, 150));
      clauses.push(`p.${column} = $${params.length}`);
    }
  }
  if (req.query.category !== undefined) {
    params.push(v.text(req.query.category, 'category', 100));
    clauses.push(`(c.slug = $${params.length} OR c.name = $${params.length})`);
  }
  if (req.query.search !== undefined) {
    params.push('%' + v.text(req.query.search, 'search', 200).replace(/[\\%_]/g, '\\$&') + '%');
    clauses.push(`(p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }
  const { rows } = await req.app.locals.db.query(`${select}${clauses.length ? ' WHERE ' + clauses.join(' AND ') : ''} ORDER BY p.id`, params);
  res.json(rows.map(product));
};
exports.detail = async (req, res) => {
  const row = await find(req.app.locals.db, req.params.id);
  if (!row || (!row.is_active && req.user?.role !== 'admin')) throw new HttpError(404, 'Producto no encontrado');
  res.json(product(row));
};
async function values(db, input, partial) {
  const result = {};
  const required = { title: 10000, game: 100, edition: 150, color: 80, cardType: 80, image: 10000 };
  for (const [key, max] of Object.entries(required)) {
    if (!partial || input[key] !== undefined) result[{ cardType: 'card_type', image: 'image_url' }[key] || key] = v.text(input[key], key, max);
  }
  for (const key of ['price', 'stock', 'cost']) if (!partial || input[key] !== undefined) result[key] = v.integer(input[key], key);
  for (const [key, options] of Object.entries({ rarity: ['Common', 'Uncommon', 'Rare', 'Ultra Rare'], condition: ['Near Mint', 'Lightly Played', 'Moderately Played'] })) {
    if (!partial || input[key] !== undefined) result[key] = v.choice(input[key], key, options);
  }
  if (!partial || input.category !== undefined || input.categorySlug !== undefined) {
    const category = v.text(input.categorySlug ?? input.category, 'category/categorySlug', 100);
    const { rows } = await db.query('SELECT id FROM categories WHERE slug = $1 OR name = $1', [category]);
    if (!rows[0]) v.fail('La categoría no existe');
    result.category_id = rows[0].id;
  }
  if (input.description !== undefined) {
    if (typeof input.description !== 'string' || input.description.length > 10000) v.fail('description debe ser texto de hasta 10000 caracteres');
    result.description = input.description.trim();
  } else if (!partial) result.description = result.title;
  if (input.code !== undefined) result.code = v.text(input.code, 'code', 80);
  else if (!partial) result.code = `TCG-${randomUUID()}`;
  for (const [key, column] of Object.entries({ hasButton: 'has_button', isActive: 'is_active' })) {
    if (input[key] !== undefined) result[column] = v.boolean(input[key], key);
  }
  return result;
}
exports.create = async (req, res) => {
  const db = req.app.locals.db, data = await values(db, req.body, false);
  const columns = Object.keys(data);
  const { rows } = await db.query(`INSERT INTO products (${columns.join(', ')}) VALUES (${columns.map((_, i) => '$' + (i + 1)).join(', ')}) RETURNING code`, Object.values(data));
  res.status(201).json(product(await find(db, rows[0].code)));
};
exports.update = async (req, res) => {
  const db = req.app.locals.db, existing = await find(db, req.params.id);
  if (!existing) throw new HttpError(404, 'Producto no encontrado');
  const data = await values(db, req.body, true), columns = Object.keys(data);
  if (!columns.length) v.fail('Debes enviar al menos un campo del producto');
  await db.query(`UPDATE products SET ${columns.map((key, i) => `${key} = $${i + 1}`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${columns.length + 1}`, [...Object.values(data), existing.id]);
  res.json(product(await find(db, data.code || existing.code)));
};
exports.remove = async (req, res) => {
  const db = req.app.locals.db, existing = await find(db, req.params.id);
  if (!existing) throw new HttpError(404, 'Producto no encontrado');
  try { await db.query('DELETE FROM products WHERE id = $1', [existing.id]); }
  catch (err) {
    if (err.code !== '23503') throw err;
    await db.query('UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [existing.id]);
  }
  res.json({ message: 'Producto eliminado', id: existing.code });
};
