import { query } from "./db.js";

export async function listStores() {
  const res = await query(
    "SELECT id, name, manager_id as \"managerId\", active FROM stores ORDER BY name"
  );
  return res.rows;
}

export async function createStore({ name, managerId, active = true }) {
  const res = await query(
    `INSERT INTO stores (name, manager_id, active)
     VALUES ($1, $2, $3)
     RETURNING id, name, manager_id as "managerId", active`,
    [name, managerId || null, active]
  );
  return res.rows[0];
}

export async function updateStore(id, fields) {
  const allowed = ["name", "manager_id", "active"];
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
    `UPDATE stores SET ${set.join(", ")} WHERE id = $${params.length}
     RETURNING id, name, manager_id as "managerId", active`,
    params
  );
  return res.rows[0];
}

export async function deleteStore(id) {
  await query("DELETE FROM stores WHERE id = $1", [id]);
}
