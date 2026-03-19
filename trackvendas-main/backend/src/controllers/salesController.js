import { listSales, createSale } from "../services/salesService.js";

export async function getSales(req, res) {
  const { vendorId, storeId } = req.query;
  const sales = await listSales({ vendorId, storeId });
  return res.json(sales);
}

export async function postSale(req, res) {
  const { vendorId, storeId, amount, date } = req.body || {};
  if (!vendorId || !storeId || amount === undefined || !date) {
    return res.status(400).json({ error: "Campos obrigatorios ausentes." });
  }
  const sale = await createSale({ vendorId, storeId, amount, date });
  return res.status(201).json(sale);
}
