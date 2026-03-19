import bcrypt from "bcrypt";
import { query } from "./db.js";

export async function findUserByEmail(email) {
  const res = await query(
    "SELECT id, name, email, role, store_id as \"storeId\", active, password_hash FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
}

export async function validatePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
