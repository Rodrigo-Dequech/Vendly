import jwt from "jsonwebtoken";
import { findUserByEmail, validatePassword } from "../services/authService.js";

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email e senha sao obrigatorios." });

  const user = await findUserByEmail(email);
  if (!user || user.active === false) return res.status(401).json({ error: "Credenciais invalidas." });

  const ok = await validatePassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciais invalidas." });

  const token = jwt.sign(
    { sub: user.id, role: user.role, storeId: user.storeId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
  );

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    storeId: user.storeId,
    active: user.active,
  };

  return res.json({ token, user: safeUser });
}
