import pool from "../db.js";

// 1. GET: Obtener todos los alumnos (Para el mapa del Admin)
export const getAlumnos = async (req, res) => {
  try {
    // Solo devolvemos nombre, matricula y ubicacion
    const result = await pool.query("SELECT id, nombre, matricula, lat, lng, ultima_actualizacion FROM alumnos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo alumnos" });
  }
};

// 2. POST: Crear Alumno (Solo DB, el correo lo envía el Frontend)
export const invitarAlumno = async (req, res) => {
  try {
    const { matricula, nombre, correo } = req.body;

    // Verificar si ya existe
    const existe = await pool.query("SELECT * FROM alumnos WHERE matricula = $1", [matricula]);
    
    if (existe.rows.length > 0) {
      return res.status(400).json({ ok: false, msg: "La matrícula ya existe" });
    }

    // Insertar alumno nuevo (inicialmente sin ubicación)
    await pool.query(
      "INSERT INTO alumnos (nombre, matricula, en_alerta) VALUES ($1, $2, false)",
      [nombre || 'Alumno', matricula]
    );

    res.json({ ok: true, msg: "Alumno registrado. Enviando correo..." });
  } catch (err) {
    console.error("Error creando alumno:", err);
    res.status(500).json({ ok: false, msg: "Error de base de datos" });
  }
};

// 3. POST: Login de alumno por matrícula
export const loginAlumno = async (req, res) => {
  try {
    const { matricula } = req.body;
    
    const result = await pool.query("SELECT * FROM alumnos WHERE matricula = $1", [matricula]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Matrícula no encontrada" });
    }

    const alumno = result.rows[0];
    // Retornamos datos básicos para guardar en el navegador
    res.json({ ok: true, alumno: { id: alumno.id, nombre: alumno.nombre, matricula: alumno.matricula } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error de servidor" });
  }
};

// 4. PUT: Actualizar Ubicación GPS
export const guardarUbicacion = async (req, res) => {
  try {
    const { matricula, lat, lng } = req.body;

    await pool.query(
      "UPDATE alumnos SET lat = $1, lng = $2, ultima_actualizacion = CURRENT_TIMESTAMP WHERE matricula = $3",
      [lat, lng, matricula]
    );

    res.json({ ok: true, msg: "Ubicación actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error guardando GPS" });
  }
};

// Mantén tus otras funciones si las usas (getAlumnoPorMatricula, setAlerta, eliminarAlumno) aquí abajo...
export const eliminarAlumno = async (req, res) => {
    /* Tu código existente de eliminar */
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM alumnos WHERE id = $1", [id]);
        res.json({ ok: true, msg: "Eliminado" });
    } catch (e) { res.status(500).json({error: e.message}) }
};