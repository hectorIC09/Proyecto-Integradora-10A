import db from "../db.js";

// Buscar usuario por email
export async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM login WHERE email = ?", [email]);
  return rows[0];
}

// Crear usuario nuevo
export async function createUser({ name, email, password_hash }) {
  await db.query(
    "INSERT INTO login (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, password_hash]
  );
}
