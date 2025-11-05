// userModel.js (CORREGIDO PARA POSTGRESQL)

import db from "../db.js";

// Buscar usuario por email
export async function findByEmail(email) {
  // 1. Cambios: Usar $1 en lugar de ? y usar la tabla _login
  const result = await db.query("SELECT * FROM public._login WHERE email = $1", [email]); 
  
  // 2. Cambio: Devolver el primer elemento de la propiedad 'rows'
  return result.rows[0]; 
}

// Crear usuario nuevo
export async function createUser({ name, email, password_hash }) {
  // Cambios: Usar $1, $2, $3 en lugar de ?, ?, ? y usar la tabla _login
  await db.query(
    "INSERT INTO public._login (name, email, password_hash) VALUES ($1, $2, $3)",
    [name, email, password_hash]
  );
}