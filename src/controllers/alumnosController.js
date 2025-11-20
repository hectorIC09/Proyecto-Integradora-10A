import pool from "../db.js";

// 1. GET: Para el Mapa del Admin
export const getAlumnos = async (req, res) => {
  try {
    // Solo traemos a los que ya tienen ubicación
    const result = await pool.query("SELECT * FROM alumnos WHERE lat IS NOT NULL");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// 2. POST: Invitar (Solo guarda Email)
export const invitarAlumno = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verificar si ya existe
    const check = await pool.query("SELECT * FROM alumnos WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ ok: false, msg: "Este correo ya fue invitado" });
    }

    // Crear registro vacío solo con email
    await pool.query("INSERT INTO alumnos (email) VALUES ($1)", [email]);
    
    res.json({ ok: true, msg: "Invitación creada. Enviando correo..." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error de BD" });
  }
};

// 3. POST: El Alumno llena sus datos (Nombre y Matrícula)
export const completarRegistro = async (req, res) => {
  try {
    const { email, nombre, matricula } = req.body;

    const result = await pool.query(
      "UPDATE alumnos SET nombre = $1, matricula = $2, registrado = TRUE WHERE email = $3 RETURNING *",
      [nombre, matricula, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, msg: "Correo no encontrado en invitaciones" });
    }

    res.json({ ok: true, alumno: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error al registrar. ¿Quizás la matrícula ya existe?" });
  }
};

// 4. POST: Guardar Ubicación
export const guardarUbicacion = async (req, res) => {
  try {
    const { matricula, lat, lng } = req.body;
    await pool.query(
      "UPDATE alumnos SET lat = $1, lng = $2, ultima_actualizacion = CURRENT_TIMESTAMP WHERE matricula = $3",
      [lat, lng, matricula]
    );
    res.json({ ok: true, msg: "Ubicación actualizada" });
  } catch (err) {
    res.status(500).json({ ok: false, msg: "Error GPS" });
  }
};

// 5. DELETE: Eliminar alumno
export const eliminarAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM alumnos WHERE id = $1", [id]);
        res.json({ ok: true });
    } catch (e) { res.status(500).json({error: e.message}) }
};