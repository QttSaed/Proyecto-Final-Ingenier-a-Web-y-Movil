const { test, beforeEach } = require('node:test');
const mailer = require('../src/services/mailer');
beforeEach(t => {
  t.mock.method(mailer, 'sendVerificationEmail', async ({ token, clientUrl }) => ({ sent: false, mock: true, verificationUrl: `${clientUrl}/verificar-correo?token=${token}` }));
});
const assert = require('node:assert/strict');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createApp } = require('../src/app');
const secret = 'test-secret-with-at-least-32-characters';
const user = { id: 1, name: 'Cliente', email: 'cliente@tcgstore.com', role: 'client', is_verified: true, phone: null, address: null, city: null, region: null };
const product = { id: 1, code: 'pokemon-0', category_id: 8, category: 'Pokemon', category_slug: 'pokemon', title: 'Carta', description: 'Carta', price: 23000, stock: 5, game: 'Pokemon', edition: 'Base', rarity: 'Rare', color: 'Rojo', cost: 0, card_type: 'Carta', condition: 'Near Mint', image_url: '/card.png', is_active: true, has_button: true };
const order = { id: 1, order_number: 'TCG-TEST', user_id: 1, status: 'Pendiente', admin_notes: null, subtotal: 23000, shipping_cost: 3500, total: 26500, shipping_name: 'Cliente', shipping_email: user.email, shipping_address: 'Calle 1', shipping_city: 'Santiago', shipping_region: 'Metropolitana', payment_method: 'Transferencia', created_at: '2026-10-13' };
const item = { id: 1, order_id: 1, product_id: 1, quantity: 1, unit_price: 23000, code: product.code, title: product.title, image_url: product.image_url };
const inputProduct = { title: 'Carta', price: 23000, stock: 5, categorySlug: 'pokemon', game: 'Pokemon', edition: 'Base', rarity: 'Rare', color: 'Rojo', cost: 0, cardType: 'Carta', condition: 'Near Mint', image: '/card.png' };
const inputOrder = { items: [{ code: product.code, quantity: 1 }], shippingName: 'Cliente', shippingEmail: user.email, shippingAddress: 'Calle 1', shippingCity: 'Santiago', shippingRegion: 'Metropolitana', paymentMethod: 'Transferencia' };
function token(role = 'client', id = 1) { return jwt.sign({ role, email: user.email, name: user.name }, secret, { subject: String(id), expiresIn: '1h' }); }
function setup(steps = []) {
  const calls = [];
  const db = {
    async query(sql, params = []) {
      calls.push({ sql, params });
      const step = steps.shift();
      assert.ok(step, `Consulta inesperada: ${sql}`);
      assert.match(sql, step.sql);
      if (step.check) step.check(params, sql);
      if (step.error) throw step.error;
      return { rows: step.rows || [], rowCount: (step.rows || []).length };
    },
    async getClient() { return { query: db.query.bind(db), release() { calls.push({ release: true }); } }; }
  };
  return { api: request(createApp({ db, jwtSecret: secret, authRateLimit: 1000 })), calls, done() { assert.equal(steps.length, 0); } };
}
test('health, categorías y rutas inexistentes', async () => {
  const s = setup([{ sql: /FROM categories ORDER BY name/, rows: [{ id: 8, name: 'Pokemon', slug: 'pokemon' }] }]);
  assert.deepEqual((await s.api.get('/api/health').expect(200)).body, { status: 'ok' });
  await s.api.get('/api/categories').expect(200);
  await s.api.get('/api/unknown').expect(404);
  s.done();
});
test('registro genera hash bcrypt y token de verificación sin exponer contraseña', async () => {
  const s = setup([{ sql: /SELECT id FROM users/, check: p => assert.equal(p[0], 'nuevo@example.com') },
    { sql: /INSERT INTO users/, rows: [{ ...user, email: 'nuevo@example.com', is_verified: false }], check: async p => {
      assert.match(p[2], /^\$2[aby]\$10\$/);
    } }]);
  const response = await s.api.post('/api/auth/register').send({ name: ' Cliente ', email: 'NUEVO@example.com', password: 'Password123' }).expect(201);
  assert.equal(response.body.user.role, 'client');
  assert.equal(response.body.user.password_hash, undefined);
  assert.equal(response.body.token, undefined);
  assert.equal(response.body.requiresVerification, true);
  assert.equal(response.body.user.isVerified, false);
  assert.equal(response.body.email, 'nuevo@example.com');
  assert.match(s.calls[1].params[3], /^[a-f0-9]{64}$/);
  assert.match(s.calls[1].sql, /false, \$4, CURRENT_TIMESTAMP \+ INTERVAL '24 hours'/);
  assert.equal(new URL(response.body.verificationUrl).searchParams.get('token'), s.calls[1].params[3]);
  assert.equal(await bcrypt.compare('Password123', s.calls[1].params[2]), true);
  s.done();
});
test('registro rechaza datos inválidos y correo duplicado', async () => {
  const s = setup([{ sql: /SELECT id FROM users/, rows: [{ id: 1 }] }]);
  await s.api.post('/api/auth/register').send({ name: 'X', email: 'incorrecto', password: 'Password123' }).expect(400);
  await s.api.post('/api/auth/register').send({ name: 'X', email: user.email, password: '12345678' }).expect(400);
  await s.api.post('/api/auth/register').send({ name: 'X', email: user.email, password: 'Password123' }).expect(409);
  s.done();
});
test('login acepta hashes del esquema, rechaza credenciales y permite consultar/editar perfil', async () => {
  const hash = '$2b$10$d/yDCuwtT9GqoctibjudGemuKbLjMI6W4GgViw.93msxcLA3YxUB.';
  const s = setup([{ sql: /FROM users WHERE email/, rows: [{ ...user, password_hash: hash }] },
    { sql: /FROM users WHERE email/, rows: [{ ...user, password_hash: hash }] },
    { sql: /FROM users WHERE id/, rows: [user] }, { sql: /UPDATE users/, rows: [{ ...user, name: 'Nuevo' }] },
    { sql: /FROM users WHERE id/, rows: [] }]);
  const response = await s.api.post('/api/auth/login').send({ email: user.email, password: '123456' }).expect(200);
  assert.equal(response.body.user.password_hash, undefined);
  assert.equal(response.body.user.isVerified, true);
  assert.equal(jwt.verify(response.body.token, secret).sub, '1');
  const bad = await s.api.post('/api/auth/login').send({ email: user.email, password: 'incorrecta' }).expect(401);
  assert.equal(bad.body.message, 'Correo o contraseña incorrectos');
  await s.api.get('/api/auth/me').expect(401);
  await s.api.get('/api/auth/me').set('Authorization', 'Bearer invalid').expect(401);
  await s.api.get('/api/auth/me').set('Authorization', `Bearer ${response.body.token}`).expect(200);
  await s.api.put('/api/auth/me').set('Authorization', `Bearer ${token()}`).send({ name: 'Nuevo', role: 'admin' }).expect(200);
  await s.api.get('/api/auth/me').set('Authorization', `Bearer ${token()}`).expect(404);
  s.done();
});
test('productos: filtros parametrizados, activos y detalle por código/id', async () => {
  const s = setup([{ sql: /p.is_active = true/, rows: [product], check: (params, sql) => {
    assert.ok(!sql.includes('Pokemon')); assert.deepEqual(params, ['Pokemon', 'Base', 'Rare', 'Rojo', 0, 'Carta', 'Near Mint', 'pokemon', '%Carta%']);
  } }, { sql: /ORDER BY p.id/, rows: [], check: (p, sql) => assert.ok(!sql.includes('p.is_active = true')) },
  { sql: /p.is_active = true/, rows: [product] }, { sql: /p.code = \$1/, rows: [product] },
  { sql: /p.id::text = \$1/, rows: [product] }, { sql: /p.code = \$1/, rows: [] }]);
  const response = await s.api.get('/api/products').query({ category: 'pokemon', game: 'Pokemon', edition: 'Base', rarity: 'Rare', color: 'Rojo', cost: 0, cardType: 'Carta', condition: 'Near Mint', search: 'Carta' }).expect(200);
  assert.equal(response.body[0].id, product.code); assert.equal(response.body[0].priceFormatted, '$23.000');
  await s.api.get('/api/products?includeInactive=true').set('Authorization', `Bearer ${token('admin')}`).expect(200);
  await s.api.get('/api/products?includeInactive=true').set('Authorization', `Bearer ${token()}`).expect(200);
  await s.api.get('/api/products/pokemon-0').expect(200);
  await s.api.get('/api/products/1').expect(200);
  await s.api.get('/api/products/missing').expect(404);
  await s.api.get('/api/products?cost=abc').expect(400);
  s.done();
});
test('productos: CRUD admin, restricciones y desactivación con referencias', async () => {
  const s = setup([{ sql: /FROM categories/, rows: [{ id: 8 }] }, { sql: /INSERT INTO products/, rows: [{ code: product.code }] },
    { sql: /FROM products p JOIN/, rows: [product] }, { sql: /FROM products p JOIN/, rows: [product] },
    { sql: /UPDATE products SET price/, check: p => assert.deepEqual(p, [25000, 1]) },
    { sql: /FROM products p JOIN/, rows: [{ ...product, price: 25000 }] },
    { sql: /FROM products p JOIN/, rows: [product] }, { sql: /DELETE FROM products/, error: { code: '23503' } },
    { sql: /UPDATE products SET is_active = false/ }, { sql: /FROM products p JOIN/, rows: [product] },
    { sql: /DELETE FROM products/ }, { sql: /FROM products p JOIN/, rows: [] }]);
  await s.api.post('/api/products').send(inputProduct).expect(401);
  await s.api.post('/api/products').set('Authorization', `Bearer ${token()}`).send(inputProduct).expect(403);
  await s.api.post('/api/products').set('Authorization', `Bearer ${token('admin')}`).send({}).expect(400);
  await s.api.post('/api/products').set('Authorization', `Bearer ${token('admin')}`).send(inputProduct).expect(201);
  await s.api.put('/api/products/1').set('Authorization', `Bearer ${token('admin')}`).send({ price: 25000 }).expect(200);
  await s.api.delete('/api/products/1').set('Authorization', `Bearer ${token('admin')}`).expect(200);
  await s.api.delete('/api/products/1').set('Authorization', `Bearer ${token('admin')}`).expect(200);
  await s.api.put('/api/products/missing').set('Authorization', `Bearer ${token('admin')}`).send({ price: 1 }).expect(404);
  s.done();
});
test('orden: transacción, cálculo de totales y descuento de stock', async () => {
  const s = setup([{ sql: /^BEGIN$/ }, { sql: /FOR UPDATE/, rows: [product] },
    { sql: /SELECT order_number FROM orders/, rows: [{ order_number: 'TCG-2026-0004' }], check: p => assert.deepEqual(p, [String.raw`^TCG-${new Date().getFullYear()}-\d+$`]) },
    { sql: /INSERT INTO orders/, rows: [order], check: p => { assert.equal(p[0], `TCG-${new Date().getFullYear()}-0005`); assert.deepEqual(p.slice(1, 5), ['1', 23000, 3500, 26500]); } },
    { sql: /UPDATE products SET stock = stock -/, check: p => assert.deepEqual(p, [1, 1]) },
    { sql: /INSERT INTO order_items/, check: p => assert.deepEqual(p, [1, 1, 1, 23000]) },
    { sql: /FROM order_items/, rows: [item] }, { sql: /^COMMIT$/ }]);
  await s.api.post('/api/orders').send(inputOrder).expect(401);
  await s.api.post('/api/orders').set('Authorization', `Bearer ${token('admin')}`).send(inputOrder).expect(403);
  await s.api.post('/api/orders').set('Authorization', `Bearer ${token()}`).send({}).expect(400);
  const response = await s.api.post('/api/orders').set('Authorization', `Bearer ${token()}`).send(inputOrder).expect(201);
  assert.equal(response.body.total, 26500); assert.equal(response.body.items[0].code, product.code);
  assert.equal(s.calls.at(-1).release, true); s.done();
});
test('orden: rollback por stock insuficiente, producto ausente y error SQL', async () => {
  for (const [rows, status, error] of [[[product], 400], [[], 404], [[product], 500, new Error('secret database error')]]) {
    const steps = [{ sql: /^BEGIN$/ }, { sql: /FOR UPDATE/, rows }];
    if (error) steps.push({ sql: /SELECT order_number FROM orders/, rows: [{ order_number: 'TCG-2026-0004' }] }, { sql: /INSERT INTO orders/, error });
    steps.push({ sql: /^ROLLBACK$/ });
    const s = setup(steps);
    const response = await s.api.post('/api/orders').set('Authorization', `Bearer ${token()}`).send({ ...inputOrder, items: [{ code: product.code, quantity: error ? 1 : 6 }] }).expect(status);
    assert.ok(!JSON.stringify(response.body).includes('secret')); assert.equal(s.calls.at(-1).release, true); s.done();
  }
});
test('orden: agrupa duplicados y aplica envío gratis desde 50000', async () => {
  const s = setup([{ sql: /^BEGIN$/ }, { sql: /FOR UPDATE/, rows: [product] }, { sql: /FOR UPDATE/, rows: [product] },
    { sql: /SELECT order_number FROM orders/, rows: [{ order_number: 'TCG-2026-0004' }] },
    { sql: /INSERT INTO orders/, rows: [{ ...order, subtotal: 69000, shipping_cost: 0, total: 69000 }], check: p => assert.deepEqual(p.slice(2, 5), [69000, 0, 69000]) },
    { sql: /UPDATE products SET stock/, check: p => assert.equal(p[0], 3) },
    { sql: /INSERT INTO order_items/, check: p => assert.equal(p[2], 3) }, { sql: /FROM order_items/, rows: [{ ...item, quantity: 3 }] }, { sql: /^COMMIT$/ }]);
  await s.api.post('/api/orders').set('Authorization', `Bearer ${token()}`).send({ ...inputOrder, items: [{ code: product.code, quantity: 1 }, { code: product.code, quantity: 2 }] }).expect(201);
  s.done();
});
test('órdenes: listado por rol, propiedad, detalle y cambio de estado PATCH/PUT', async () => {
  const s = setup([{ sql: /WHERE o.user_id = \$1/, rows: [order], check: p => assert.deepEqual(p, ['1']) }, { sql: /FROM order_items/, rows: [item] },
    { sql: /ORDER BY o.created_at/, rows: [order], check: (p, sql) => assert.ok(!sql.includes('WHERE o.user_id')) }, { sql: /FROM order_items/, rows: [item] },
    { sql: /o.order_number = \$1/, rows: [order] }, { sql: /FROM order_items/, rows: [item] },
    { sql: /o.order_number = \$1/, rows: [order] }, { sql: /o.order_number = \$1/, rows: [] },
    ...['Pagado', 'Enviado'].flatMap(status => [{ sql: /^BEGIN$/ }, { sql: /o.id::text = \$1/, rows: [order] }, { sql: /UPDATE orders SET status/, rows: [{ ...order, status }], check: p => assert.deepEqual(p, [status, null, 1]) }, { sql: /FROM order_items/, rows: [item] }, { sql: /^COMMIT$/ }]),
    { sql: /^BEGIN$/ }, { sql: /o.order_number = \$1/, rows: [] }, { sql: /^ROLLBACK$/ }]);
  await s.api.get('/api/orders').set('Authorization', `Bearer ${token()}`).expect(200);
  await s.api.get('/api/orders').set('Authorization', `Bearer ${token('admin')}`).expect(200);
  await s.api.get('/api/orders/TCG-TEST').set('Authorization', `Bearer ${token()}`).expect(200);
  await s.api.get('/api/orders/TCG-TEST').set('Authorization', `Bearer ${token('client', 2)}`).expect(403);
  await s.api.get('/api/orders/missing').set('Authorization', `Bearer ${token()}`).expect(404);
  await s.api.patch('/api/orders/1/status').set('Authorization', `Bearer ${token()}`).send({ status: 'Pagado' }).expect(403);
  await s.api.patch('/api/orders/1/status').set('Authorization', `Bearer ${token('admin')}`).send({ status: 'Inválido' }).expect(400);
  await s.api.patch('/api/orders/1/status').set('Authorization', `Bearer ${token('admin')}`).send({ status: 'Pagado' }).expect(200);
  await s.api.put('/api/orders/1/status').set('Authorization', `Bearer ${token('admin')}`).send({ status: 'Enviado' }).expect(200);
  await s.api.put('/api/orders/missing/status').set('Authorization', `Bearer ${token('admin')}`).send({ status: 'Pagado' }).expect(404);
  s.done();
  for (const [from, to, stock] of [['Pendiente', 'Cancelado', 5], ['Entregado', 'Reembolsado', 5], ['Cancelado', 'Pagado', 5], ['Reembolsado', 'Pendiente', 0], ['Cancelado', 'Reembolsado', 5]]) {
    const inactive = status => ['Cancelado', 'Reembolsado'].includes(status);
    const changed = inactive(from) !== inactive(to);
    const expected = changed && !inactive(to) && stock === 0 ? 400 : 200;
    const steps = [{ sql: /^BEGIN$/ }, { sql: /FOR UPDATE OF o/, rows: [{ ...order, status: from }] }];
    if (changed) {
      steps.push({ sql: /FROM order_items/, rows: [item] });
      if (!inactive(to)) steps.push({ sql: /FROM products.*FOR UPDATE/, rows: [{ ...product, stock }] });
      if (expected === 200) steps.push({ sql: inactive(to) ? /stock = stock \+/ : /stock = stock -/, check: p => assert.deepEqual(p, [1, 1]) });
    }
    if (expected === 400) steps.push({ sql: /^ROLLBACK$/ });
    else steps.push({ sql: /admin_notes = COALESCE/, rows: [{ ...order, status: to, admin_notes: 'Nota' }], check: p => assert.deepEqual(p, [to, 'Nota', 1]) }, { sql: /FROM order_items/, rows: [item] }, { sql: /^COMMIT$/ });
    const scenario = setup(steps);
    const response = await scenario.api.patch('/api/orders/1/status').set('Authorization', `Bearer ${token('admin')}`).send({ status: to, adminNotes: 'Nota' }).expect(expected);
    if (expected === 200) assert.equal(response.body.adminNotes, 'Nota');
    assert.equal(scenario.calls.at(-1).release, true);
    scenario.done();
  }
  const invalid = setup();
  await invalid.api.patch('/api/orders/1/status').set('Authorization', `Bearer ${token('admin')}`).send({ status: 'Pagado', adminNotes: 123 }).expect(400);
  invalid.done();

});


test('estadísticas admin: permisos, totales numéricos y pedidos con items', async () => {
  const s = setup([
    { sql: /SUM\(total\)/, rows: [{ total_sales: '26500', total_orders: '1', total_products: '1', total_stock: '5', total_clients: '1' }], check: (p, sql) => { assert.match(sql, /is_active = true/); assert.match(sql, /role = 'client'/); } },
    { sql: /ORDER BY o.created_at DESC, o.id DESC LIMIT 6/, rows: [order] },
    { sql: /FROM order_items/, rows: [item] }
  ]);
  await s.api.get('/api/admin/stats').expect(401);
  await s.api.get('/api/admin/stats').set('Authorization', `Bearer ${token()}`).expect(403);
  const { body } = await s.api.get('/api/admin/stats').set('Authorization', `Bearer ${token('admin')}`).expect(200);
  assert.equal(body.totalSales, 26500); assert.equal(body.totalOrders, 1);
  assert.equal(body.totalProducts, 1); assert.equal(body.totalStock, 5); assert.equal(body.totalClients, 1);
  assert.equal(body.recentOrders[0].items[0].code, product.code); s.done();
});

test('estadísticas admin: tienda vacía y error de base de datos', async () => {
  const s = setup([{ sql: /SUM\(total\)/, rows: [{ total_sales: '0', total_orders: '0', total_products: '0', total_stock: '0', total_clients: '0' }] }, { sql: /LIMIT 6/, rows: [] }, { sql: /SUM\(total\)/, error: new Error('private database error') }]);
  const { body } = await s.api.get('/api/admin/stats').set('Authorization', `Bearer ${token('admin')}`).expect(200);
  assert.equal(body.totalSales, 0); assert.deepEqual(body.recentOrders, []);
  const error = await s.api.get('/api/admin/stats').set('Authorization', `Bearer ${token('admin')}`).expect(500);
  assert.ok(!JSON.stringify(error.body).includes('private database')); s.done();
});


test('login rechaza cuentas pendientes de verificación', async () => {
  const password_hash = await bcrypt.hash('Password123', 10);
  const s = setup([{ sql: /FROM users WHERE email/, rows: [{ ...user, is_verified: false, password_hash }] }]);
  const response = await s.api.post('/api/auth/login').send({ email: user.email, password: 'Password123' }).expect(403);
  assert.match(response.body.message, /Debes verificar tu correo/);
  s.done();
});

test('verificación acepta tokens por POST y GET y devuelve una sesión', async () => {
  for (const method of ['post', 'get']) {
    const s = setup([
      { sql: /WHERE verification_token = \$1/, rows: [{ ...user, is_verified: false, verification_expires_at: new Date(Date.now() + 86400000) }], check: p => assert.deepEqual(p, ['valid-token']) },
      { sql: /UPDATE users SET is_verified = true, verification_token = NULL, verification_expires_at = NULL/, rows: [user], check: p => assert.deepEqual(p, [user.id]) }
    ]);
    const req = s.api[method]('/api/auth/verify-email');
    const response = await (method === 'post' ? req.send({ token: 'valid-token' }) : req.query({ token: 'valid-token' })).expect(200);
    assert.equal(response.body.user.isVerified, true);
    assert.equal(jwt.verify(response.body.token, secret).sub, '1');
    s.done();
  }
});

test('verificación rechaza tokens ausentes, inválidos y expirados', async () => {
  const s = setup([
    { sql: /WHERE verification_token/, rows: [] },
    { sql: /WHERE verification_token/, rows: [{ ...user, verification_expires_at: new Date(Date.now() - 1000) }] }
  ]);
  await s.api.post('/api/auth/verify-email').send({}).expect(400);
  await s.api.get('/api/auth/verify-email').expect(400);
  const invalid = await s.api.post('/api/auth/verify-email').send({ token: 'invalid' }).expect(400);
  assert.match(invalid.body.message, /inválido/);
  const expired = await s.api.get('/api/auth/verify-email').query({ token: 'expired' }).expect(400);
  assert.match(expired.body.message, /expirado/);
  s.done();
});

test('reenvío genera un token nuevo y envía el enlace a cuentas pendientes', async () => {
  const s = setup([
    { sql: /FROM users WHERE email/, rows: [{ ...user, is_verified: false }], check: p => assert.deepEqual(p, [user.email]) },
    { sql: /UPDATE users SET verification_token = \$1, verification_expires_at = CURRENT_TIMESTAMP \+ INTERVAL '24 hours'/, check: p => { assert.match(p[0], /^[a-f0-9]{64}$/); assert.equal(p[1], user.id); } }
  ]);
  const response = await s.api.post('/api/auth/resend-verification').send({ email: user.email.toUpperCase() }).expect(200);
  assert.equal(response.body.email, user.email);
  assert.equal(new URL(response.body.verificationUrl).searchParams.get('token'), s.calls[1].params[0]);
  const call = mailer.sendVerificationEmail.mock.calls[0].arguments[0];
  assert.equal(call.email, user.email);
  assert.equal(call.name, user.name);
  assert.equal(call.token, s.calls[1].params[0]);
  s.done();
});

test('reenvío valida el correo, admite cuentas desconocidas y rechaza cuentas verificadas', async () => {
  const s = setup([{ sql: /FROM users WHERE email/, rows: [] }, { sql: /FROM users WHERE email/, rows: [user] }]);
  await s.api.post('/api/auth/resend-verification').send({ email: 'invalid' }).expect(400);
  const missing = await s.api.post('/api/auth/resend-verification').send({ email: 'missing@example.com' }).expect(200);
  assert.match(missing.body.message, /Si el correo está registrado/);
  const verified = await s.api.post('/api/auth/resend-verification').send({ email: user.email }).expect(400);
  assert.match(verified.body.message, /ya se encuentra verificada/);
  assert.equal(mailer.sendVerificationEmail.mock.callCount(), 0);
  s.done();
});
