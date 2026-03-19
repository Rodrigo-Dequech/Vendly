import { query } from "./db.js";

export async function listUsers({ storeId, role }) {
  const params = [];
  const where = [];
  if (storeId) {
    params.push(storeId);
    where.push(`store_id = $${params.length}`);
  }
  if (role) {
    params.push(role);
    where.push(`role = $${params.length}`);
  }

  const sql = `SELECT id, name, email, role, store_id as "storeId", active
    FROM users
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY name`;
  const res = await query(sql, params);
  return res.rows;
}

export async function createUser({ name, email, role, storeId, passwordHash, active = true }) {
  const res = await query(
    `INSERT INTO users (name, email, role, store_id, password_hash, active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, role, store_id as "storeId", active`,
    [name, email, role, storeId, passwordHash, active]
  );
  return res.rows[0];
}

export async function updateUser(id, fields) {
  const allowed = ["name", "email", "role", "store_id", "active", "password_hash"]; 
  const set = [];
  const params = [];
  for (const [key, value] of Object.entries(fields)) {
    if (!allowed.includes(key)) continue;
    params.push(value);
    set.push(`${key} = $${params.length}`);
  }
  if (!set.length) return null;
  params.push(id);
  const res = await query(
    `UPDATE users SET ${set.join(", ")} WHERE id = $${params.length}
     RETURNING id, name, email, role, store_id as "storeId", active`,
    params
  );
  return res.rows[0];
}

export async function deleteUser(id) {
  await query("DELETE FROM users WHERE id = $1", [id]);
}
