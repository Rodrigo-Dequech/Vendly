import { query } from "./db.js";

export async function listLosses({ vendorId, storeId }) {
  const params = [];
  const where = [];
  if (vendorId) {
    params.push(vendorId);
    where.push(`l.vendor_id = $${params.length}`);
  }
  if (storeId) {
    params.push(storeId);
    where.push(`l.store_id = $${params.length}`);
  }
  const res = await query(
    `SELECT l.id, l.vendor_id as "vendorId", l.store_id as "storeId", l.reason_id as "reasonId",
            r.label as "reasonLabel", l.note, l.created_at as "createdAt"
     FROM loss_records l
     JOIN loss_reasons r ON r.id = l.reason_id
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY l.created_at DESC`,
    params
  );
  return res.rows;
}

export async function createLoss({ vendorId, storeId, reasonId, note }) {
  const res = await query(
    `INSERT INTO loss_records (vendor_id, store_id, reason_id, note)
     VALUES ($1, $2, $3, $4)
     RETURNING id, vendor_id as "vendorId", store_id as "storeId", reason_id as "reasonId", note, created_at as "createdAt"`,
    [vendorId, storeId, reasonId, note || null]
  );
  const row = res.rows[0];
  const reason = await query("SELECT label FROM loss_reasons WHERE id = $1", [reasonId]);
  return { ...row, reasonLabel: reason.rows[0]?.label || "" };
}
