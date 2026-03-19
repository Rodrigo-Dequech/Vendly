import { query } from "./db.js";

export async function getStoreMetrics(storeId) {
  const totalSalesRes = await query("SELECT COUNT(*)::int as count, COALESCE(SUM(amount),0)::float as value FROM sales WHERE store_id = $1", [storeId]);
  const totalLossesRes = await query("SELECT COUNT(*)::int as count FROM loss_records WHERE store_id = $1", [storeId]);

  const vendorsRes = await query(
    "SELECT id, name FROM users WHERE role = 'vendedor' AND store_id = $1 ORDER BY name",
    [storeId]
  );
  const salesByVendorRes = await query(
    "SELECT vendor_id, COUNT(*)::int as sales, COALESCE(SUM(amount),0)::float as value FROM sales WHERE store_id = $1 GROUP BY vendor_id",
    [storeId]
  );
  const lossesByVendorRes = await query(
    "SELECT vendor_id, COUNT(*)::int as losses FROM loss_records WHERE store_id = $1 GROUP BY vendor_id",
    [storeId]
  );

  const salesByVendor = Object.fromEntries(salesByVendorRes.rows.map(r => [r.vendor_id, r]));
  const lossesByVendor = Object.fromEntries(lossesByVendorRes.rows.map(r => [r.vendor_id, r]));

  const byVendor = vendorsRes.rows.map(v => ({
    vendorId: v.id,
    vendorName: v.name,
    sales: salesByVendor[v.id]?.sales || 0,
    value: salesByVendor[v.id]?.value || 0,
    losses: lossesByVendor[v.id]?.losses || 0,
  }));

  const byReasonRes = await query(
    `SELECT r.label as reason, COUNT(*)::int as count
     FROM loss_records l
     JOIN loss_reasons r ON r.id = l.reason_id
     WHERE l.store_id = $1
     GROUP BY r.label
     ORDER BY count DESC`,
    [storeId]
  );

  return {
    totalSales: totalSalesRes.rows[0].count,
    totalValue: totalSalesRes.rows[0].value,
    totalLosses: totalLossesRes.rows[0].count,
    byVendor,
    byReason: byReasonRes.rows,
  };
}

export async function getNetworkMetrics() {
  const totalSalesRes = await query("SELECT COUNT(*)::int as count, COALESCE(SUM(amount),0)::float as value FROM sales");
  const totalLossesRes = await query("SELECT COUNT(*)::int as count FROM loss_records");

  const vendorsRes = await query("SELECT id, name FROM users WHERE role = 'vendedor' ORDER BY name");
  const salesByVendorRes = await query("SELECT vendor_id, COUNT(*)::int as sales, COALESCE(SUM(amount),0)::float as value FROM sales GROUP BY vendor_id");
  const lossesByVendorRes = await query("SELECT vendor_id, COUNT(*)::int as losses FROM loss_records GROUP BY vendor_id");

  const salesByVendor = Object.fromEntries(salesByVendorRes.rows.map(r => [r.vendor_id, r]));
  const lossesByVendor = Object.fromEntries(lossesByVendorRes.rows.map(r => [r.vendor_id, r]));

  const byVendor = vendorsRes.rows.map(v => ({
    vendorId: v.id,
    vendorName: v.name,
    sales: salesByVendor[v.id]?.sales || 0,
    value: salesByVendor[v.id]?.value || 0,
    losses: lossesByVendor[v.id]?.losses || 0,
  }));

  const byReasonRes = await query(
    `SELECT r.label as reason, COUNT(*)::int as count
     FROM loss_records l
     JOIN loss_reasons r ON r.id = l.reason_id
     GROUP BY r.label
     ORDER BY count DESC`
  );

  const storesRes = await query("SELECT id, name FROM stores ORDER BY name");
  const salesByStoreRes = await query("SELECT store_id, COUNT(*)::int as sales, COALESCE(SUM(amount),0)::float as value FROM sales GROUP BY store_id");
  const lossesByStoreRes = await query("SELECT store_id, COUNT(*)::int as losses FROM loss_records GROUP BY store_id");

  const salesByStore = Object.fromEntries(salesByStoreRes.rows.map(r => [r.store_id, r]));
  const lossesByStore = Object.fromEntries(lossesByStoreRes.rows.map(r => [r.store_id, r]));

  const byStore = storesRes.rows.map(s => ({
    storeId: s.id,
    storeName: s.name,
    sales: salesByStore[s.id]?.sales || 0,
    value: salesByStore[s.id]?.value || 0,
    losses: lossesByStore[s.id]?.losses || 0,
  }));

  return {
    totalSales: totalSalesRes.rows[0].count,
    totalValue: totalSalesRes.rows[0].value,
    totalLosses: totalLossesRes.rows[0].count,
    byVendor,
    byReason: byReasonRes.rows,
    byStore,
  };
}
