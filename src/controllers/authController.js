import bcrypt from "bcrypt";
import { findByEmail, createUser } from "../models/userModel.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios" });
    }

    const exists = await findByEmail(email);
    if (exists) return res.status(409).json({ ok: false, message: "Correo ya registrado" });

    const password_hash = await bcrypt.hash(password, 10);
    await createUser({ name, email, password_hash });

    return res.json({ ok: true, message: "Usuario registrado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Faltan datos" });
    }

    const user = await findByEmail(email);
    if (!user || !user.is_active) {
      return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    req.session.user = { id: user.id, name: user.name, email: user.email };
    return res.json({ ok: true, message: "Login correcto" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

export async function logout(req, res) {
  req.session.destroy(() => {
    res.json({ ok: true, message: "Sesión cerrada" });
  });
}

