import pool from '../db.js';

/**
 * --- API: GET /api/alumnos ---
 * Obtiene todos los alumnos de la base de datos.
 */
export const getAlumnos = async (req, res) => {
  try {
    // Lee la tabla 'alumnos' que creamos en el Paso 1
    const result = await pool.query('SELECT * FROM alumnos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * --- API: PUT /api/alumnos/alerta/:id ---
 * Cambia el estado de alerta de un alumno.
 */
export const setAlerta = async (req, res) => {
  try {
    const { id } = req.params; // El ID del alumno viene en la URL
    const { en_alerta } = req.body; // El estado (true/false) viene en el JSON

    if (en_alerta === undefined) {
      return res.status(400).json({ error: 'Falta el estado "en_alerta" en el body' });
    }

    const result = await pool.query(
      'UPDATE alumnos SET en_alerta = $1 WHERE id = $2 RETURNING *',
      [en_alerta, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json(result.rows[0]); // Devuelve el alumno actualizado
  
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};