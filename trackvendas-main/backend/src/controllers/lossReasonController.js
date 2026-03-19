import { listReasons, createReason, deleteReason } from "../services/lossReasonService.js";

export async function getReasons(_req, res) {
  const reasons = await listReasons();
  return res.json(reasons);
}

export async function postReason(req, res) {
  const { label, requiresNote } = req.body || {};
  if (!label) return res.status(400).json({ error: "Nome do motivo e obrigatorio." });
  const reason = await createReason({ label, requiresNote: !!requiresNote });
  return res.status(201).json(reason);
}

export async function removeReason(req, res) {
  const { id } = req.params;
  await deleteReason(id);
  return res.status(204).send();
}
