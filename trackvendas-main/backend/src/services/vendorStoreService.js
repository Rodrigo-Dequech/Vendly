import { query } from "./db.js";

export async function upsertVendorStore(vendorId, storeId) {
  await query(
    `INSERT INTO vendor_stores (vendor_id, store_id)
     VALUES ($1, $2)
     ON CONFLICT (vendor_id, store_id) DO NOTHING`,
    [vendorId, storeId]
  );
}

export async function removeVendorLinks(vendorId) {
  await query("DELETE FROM vendor_stores WHERE vendor_id = $1", [vendorId]);
}
