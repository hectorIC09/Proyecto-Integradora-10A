import db from "../db.js";

// Buscar usuario por email
export async function findByEmail(email) {
  const result = await db.query(
    `SELECT 
        id, 
        name, 
        email, 
        password_hash, 
        is_active,
        role
     FROM public._login 
     WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function createUser({ name, email, password_hash, role = 'admin' }) {
  await db.query(
    "INSERT INTO public._login (name, email, password_hash, is_active, role) VALUES ($1, $2, $3, 1, $4)",
    [name, email, password_hash, role]
  );
}
