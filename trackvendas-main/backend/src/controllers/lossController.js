import { listLosses, createLoss } from "../services/lossService.js";

export async function getLosses(req, res) {
  const { vendorId, storeId } = req.query;
  const losses = await listLosses({ vendorId, storeId });
  return res.json(losses);
}

export async function postLoss(req, res) {
  const { vendorId, storeId, reasonId, note } = req.body || {};
  if (!vendorId || !storeId || !reasonId) {
    return res.status(400).json({ error: "Campos obrigatorios ausentes." });
  }
  const loss = await createLoss({ vendorId, storeId, reasonId, note });
  return res.status(201).json(loss);
}
