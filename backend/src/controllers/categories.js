exports.list = async (req, res) => {
  const { rows } = await req.app.locals.db.query('SELECT id, slug, name, logo_url FROM categories ORDER BY name');
  res.json(rows);
};
