// userModel.js (CORRECCIÓN FINAL)

import db from "../db.js";

// Buscar usuario por email
export async function findByEmail(email) {
  
  // 1. **CRÍTICO:** Aseguramos que la columna se llame password_hash (todo minúsculas) 
  // y que is_active se devuelva.
  const result = await db.query(
      `SELECT 
          id, 
          name, 
          email, 
          password_hash, 
          is_active 
       FROM public._login 
       WHERE email = $1`, 
      [email]
  ); 
  
  // Devolvemos el objeto de usuario
  return result.rows[0]; 
}

// Crear usuario nuevo (ESTO YA ESTÁ BIEN)
export async function createUser({ name, email, password_hash }) {
  await db.query(
    "INSERT INTO public._login (name, email, password_hash, is_active) VALUES ($1, $2, $3, 1)", // Añadimos 'is_active'
    [name, email, password_hash]
  );
}