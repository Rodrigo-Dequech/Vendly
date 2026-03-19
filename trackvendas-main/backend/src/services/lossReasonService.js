import { query } from "./db.js";

export async function listReasons() {
  const res = await query("SELECT id, label, requires_note as \"requiresNote\" FROM loss_reasons ORDER BY label");
  return res.rows;
}

export async function createReason({ label, requiresNote }) {
  const res = await query(
    `INSERT INTO loss_reasons (label, requires_note)
     VALUES ($1, $2)
     RETURNING id, label, requires_note as "requiresNote"`,
    [label, requiresNote]
  );
  return res.rows[0];
}

export async function deleteReason(id) {
  await query("DELETE FROM loss_reasons WHERE id = $1", [id]);
}
