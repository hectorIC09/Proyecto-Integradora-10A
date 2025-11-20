import pool from "../db.js";

// 1. GET: Obtener lista para el Admin
export const obtenerAlumnos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alumnos ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. POST: Crear Invitación (Solo Email)
export const crearInvitacion = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verificar duplicados
    const check = await pool.query("SELECT id FROM alumnos WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ ok: false, msg: "Este correo ya está registrado o invitado." });
    }

    // Insertar solo el email
    await pool.query("INSERT INTO alumnos (email) VALUES ($1)", [email]);
    
    res.json({ ok: true, msg: "Invitación creada en BD" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al guardar en base de datos" });
  }
};

// 3. POST: Alumno completa su registro (Nombre y Matrícula)
export const registrarDatosAlumno = async (req, res) => {
  try {
    const { email, nombre, matricula } = req.body;

    // Actualizamos el registro que tenga ese email
    const result = await pool.query(
      "UPDATE alumnos SET nombre = $1, matricula = $2 WHERE email = $3 RETURNING *",
      [nombre, matricula, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, msg: "No se encontró una invitación para este correo." });
    }

    res.json({ ok: true, alumno: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error al registrar. Verifica que la matrícula no esté duplicada." });
  }
};

// 4. POST: Guardar Ubicación GPS (¡ESTA ES LA QUE FALTABA!)
export const actualizarUbicacion = async (req, res) => {
  try {
    const { id, lat, lng } = req.body; 
    
    await pool.query(
      "UPDATE alumnos SET lat = $1, lng = $2, ultima_ubicacion = CURRENT_TIMESTAMP WHERE id = $3",
      [lat, lng, id]
    );
    
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error guardando ubicación" });
  }
};

// 5. DELETE: Eliminar alumno
export const eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM alumnos WHERE id = $1", [id]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. PUT: Toggle Alerta
export const toggleAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { en_alerta } = req.body;
    await pool.query("UPDATE alumnos SET en_alerta = $1 WHERE id = $2", [en_alerta, id]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. POST: Login Alumno (Para que funcione tu app.js existente)
export const loginAlumno = async (req, res) => {
  try {
    const { matricula } = req.body;
    const result = await pool.query("SELECT * FROM alumnos WHERE matricula = $1", [matricula]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Matrícula no encontrada" });
    }

    res.json({ ok: true, alumno: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};