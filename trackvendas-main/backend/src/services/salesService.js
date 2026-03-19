import { query } from "./db.js";

export async function listSales({ vendorId, storeId }) {
  const params = [];
  const where = [];
  if (vendorId) {
    params.push(vendorId);
    where.push(`vendor_id = $${params.length}`);
  }
  if (storeId) {
    params.push(storeId);
    where.push(`store_id = $${params.length}`);
  }
  const res = await query(
    `SELECT id, vendor_id as "vendorId", store_id as "storeId", amount, date
     FROM sales
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY date DESC`,
    params
  );
  return res.rows;
}

export async function createSale({ vendorId, storeId, amount, date, externalId }) {
  const res = await query(
    `INSERT INTO sales (vendor_id, store_id, amount, date, external_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, vendor_id as "vendorId", store_id as "storeId", amount, date`,
    [vendorId, storeId, amount, date, externalId || null]
  );
  return res.rows[0];
}

export async function upsertSales(sales) {
  const results = [];
  for (const s of sales) {
    const res = await query(
      `INSERT INTO sales (vendor_id, store_id, amount, date, external_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (external_id) DO UPDATE SET
         vendor_id = EXCLUDED.vendor_id,
         store_id = EXCLUDED.store_id,
         amount = EXCLUDED.amount,
         date = EXCLUDED.date
       RETURNING id`,
      [s.vendorId, s.storeId, s.amount, s.date, s.externalId]
    );
    results.push(res.rows[0]);
  }
  return results;
}
