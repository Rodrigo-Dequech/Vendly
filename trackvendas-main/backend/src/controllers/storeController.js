import { listStores, createStore, updateStore, deleteStore } from "../services/storeService.js";

export async function getStores(_req, res) {
  const stores = await listStores();
  return res.json(stores);
}

export async function postStore(req, res) {
  const { name, managerId } = req.body || {};
  if (!name) return res.status(400).json({ error: "Nome da loja e obrigatorio." });
  const store = await createStore({ name, managerId });
  return res.status(201).json(store);
}

export async function putStore(req, res) {
  const { id } = req.params;
  const { name, managerId, active } = req.body || {};

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (managerId !== undefined) fields.manager_id = managerId;
  if (active !== undefined) fields.active = active;

  const store = await updateStore(id, fields);
  if (!store) return res.status(404).json({ error: "Loja nao encontrada." });
  return res.json(store);
}

export async function removeStore(req, res) {
  const { id } = req.params;
  await deleteStore(id);
  return res.status(204).send();
}
