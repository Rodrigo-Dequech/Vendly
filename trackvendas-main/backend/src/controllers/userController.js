import bcrypt from "bcrypt";
import { listUsers, createUser, updateUser, deleteUser } from "../services/userService.js";
import { upsertVendorStore, removeVendorLinks } from "../services/vendorStoreService.js";

export async function getUsers(req, res) {
  const { storeId, role } = req.query;
  const users = await listUsers({ storeId, role });
  return res.json(users);
}

export async function postUser(req, res) {
  const { name, email, role, storeId, password } = req.body || {};
  if (!name || !email || !role || !storeId) {
    return res.status(400).json({ error: "Campos obrigatorios ausentes." });
  }
  const passwordHash = await bcrypt.hash(password || "123456", 10);
  const user = await createUser({ name, email, role, storeId, passwordHash, active: true });

  if (role === "vendedor") {
    await upsertVendorStore(user.id, storeId);
  }

  return res.status(201).json(user);
}

export async function putUser(req, res) {
  const { id } = req.params;
  const { name, email, role, storeId, active, password } = req.body || {};

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email;
  if (role !== undefined) fields.role = role;
  if (storeId !== undefined) fields.store_id = storeId;
  if (active !== undefined) fields.active = active;
  if (password) fields.password_hash = await bcrypt.hash(password, 10);

  const user = await updateUser(id, fields);
  if (!user) return res.status(404).json({ error: "Usuario nao encontrado." });

  if (role === "vendedor" && storeId) {
    await upsertVendorStore(id, storeId);
  } else if (role && role !== "vendedor") {
    await removeVendorLinks(id);
  }

  return res.json(user);
}

export async function removeUser(req, res) {
  const { id } = req.params;
  await deleteUser(id);
  return res.status(204).send();
}
