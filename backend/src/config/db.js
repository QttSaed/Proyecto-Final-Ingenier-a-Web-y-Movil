const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
let adapter;
function getAdapter() {
  if (!adapter) {
    const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;
    adapter = new Pool(process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL, ssl }
      : { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 5432), user: process.env.DB_USER,
          password: process.env.DB_PASSWORD, database: process.env.DB_NAME, ssl });
  }
  return adapter;
}
exports.query = (text, params) => getAdapter().query(text, params);
exports.getClient = () => getAdapter().connect();
exports.setAdapter = (replacement) => { adapter = replacement; };
