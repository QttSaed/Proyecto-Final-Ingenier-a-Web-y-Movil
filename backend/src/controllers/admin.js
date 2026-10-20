const { withItems } = require('./orders');

exports.stats = async (req, res) => {
  const db = req.app.locals.db;
  const { rows: [totals] } = await db.query(`SELECT
    (SELECT COALESCE(SUM(total), 0) FROM orders) AS total_sales,
    (SELECT COUNT(*) FROM orders) AS total_orders,
    (SELECT COUNT(*) FROM products WHERE is_active = true) AS total_products,
    (SELECT COALESCE(SUM(stock), 0) FROM products WHERE is_active = true) AS total_stock,
    (SELECT COUNT(*) FROM users WHERE role = 'client') AS total_clients`);
  const { rows } = await db.query('SELECT o.*, u.name AS client_name, u.email AS client_email FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC, o.id DESC LIMIT 6');
  res.json({ totalSales: Number(totals.total_sales), totalOrders: Number(totals.total_orders),
    totalProducts: Number(totals.total_products), totalStock: Number(totals.total_stock),
    totalClients: Number(totals.total_clients), recentOrders: await Promise.all(rows.map(row => withItems(db, row))) });
};
