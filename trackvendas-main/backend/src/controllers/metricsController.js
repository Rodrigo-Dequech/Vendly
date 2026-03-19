import { getStoreMetrics, getNetworkMetrics } from "../services/metricsService.js";

export async function storeMetrics(req, res) {
  const { storeId } = req.params;
  const metrics = await getStoreMetrics(storeId);
  return res.json(metrics);
}

export async function networkMetrics(_req, res) {
  const metrics = await getNetworkMetrics();
  return res.json(metrics);
}
