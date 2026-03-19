import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function healthCheck() {
  const res = await query("SELECT 1 as ok");
  return res.rows[0];
}
