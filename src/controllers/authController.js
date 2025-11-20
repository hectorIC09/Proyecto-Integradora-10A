/*import bcrypt from "bcrypt";
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
    // Por seguridad, todos los registros vía este endpoint serán 'admin'
    await createUser({ name, email, password_hash, role: 'admin' });

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
    // Si no existe o está inactivo o no es admin => rechazo
    if (!user || !user.is_active || user.role !== 'admin') {
      return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    // Guardamos el rol en la sesión para validaciones posteriores
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ ok: true, message: "Login correcto", role: user.role });
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
*/

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

    // Todos los registros son admins
    await createUser({
      name,
      email,
      password_hash,
      role: "admin",
      is_active: true,
    });

    return res.json({ ok: true, message: "Usuario registrado correctamente" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Faltan datos" });

    const user = await findByEmail(email);

    if (!user)
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });

    if (!user.is_active)
      return res.status(403).json({ ok: false, message: "Usuario inactivo" });

    if (user.role !== "admin")
      return res.status(403).json({ ok: false, message: "Acceso no permitido" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });

    // Guardar todo lo necesario en la sesión
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.json({ ok: true, message: "Login correcto", role: user.role });

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
