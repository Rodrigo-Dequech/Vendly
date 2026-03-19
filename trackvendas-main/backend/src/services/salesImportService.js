import { upsertSales } from "./salesService.js";

async function fetchExternalSales() {
  const url = process.env.SALES_IMPORT_URL;
  if (!url) return [];

  const headers = {};
  if (process.env.SALES_IMPORT_TOKEN) {
    headers.Authorization = `Bearer ${process.env.SALES_IMPORT_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Import request failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.sales || [];
}

export async function runSalesImport() {
  if (!process.env.SALES_IMPORT_URL) return { skipped: true, count: 0 };

  const sales = await fetchExternalSales();
  const normalized = sales.map(s => ({
    externalId: s.externalId || s.id || s.external_id,
    vendorId: s.vendorId || s.vendor_id,
    storeId: s.storeId || s.store_id,
    amount: Number(s.amount),
    date: s.date,
  })).filter(s => s.externalId && s.vendorId && s.storeId && s.amount && s.date);

  await upsertSales(normalized);
  return { skipped: false, count: normalized.length };
}
