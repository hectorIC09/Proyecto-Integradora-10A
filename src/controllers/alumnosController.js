import pool from "../db.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Todos los alumnos
export const getAlumnos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alumnos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo alumnos" });
  }
};

// GET: Alumno por matrícula
export const getAlumnoPorMatricula = async (req, res) => {
  try {
    const { matricula } = req.params;
    const result = await pool.query(
      "SELECT * FROM alumnos WHERE matricula = $1",
      [matricula]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Alumno no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// PUT: Activar / desactivar alerta
export const setAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { en_alerta } = req.body;
    const result = await pool.query(
      "UPDATE alumnos SET en_alerta = $1 WHERE id = $2 RETURNING *",
      [en_alerta, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Alumno no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// POST: Enviar invitación por correo
export const invitarAlumno = async (req, res) => {
  try {
    const { correo, matricula } = req.body;
    if (!correo || !matricula)
      return res.status(400).json({ ok: false, msg: "Faltan datos" });

    const existe = await pool.query(
      "SELECT * FROM alumnos WHERE matricula = $1",
      [matricula]
    );
    if (existe.rows.length > 0)
      return res.json({ ok: false, msg: "La matrícula ya existe" });

    await pool.query(
      `INSERT INTO alumnos(nombre, matricula, telefono, lat_inicial, lng_inicial, en_alerta)
       VALUES('Sin Nombre', $1, null, null, null, false)`,
      [matricula]
    );

    // Enviar correo con Resend
    await resend.emails.send({
      from: "Campus Watch <onboarding@resend.dev>",
      to: correo,
      subject: "Invitación a Campus Watch",
      html: `
        <h2>Bienvenido a Campus Watch</h2>
        <p>Tu matrícula es: <strong>${matricula}</strong></p>
        <p>Puedes activar tu ubicación desde el siguiente enlace:</p>
        <a href="${process.env.APP_BASE_URL}/alumno.html?matricula=${matricula}"
           style="background:#007bff;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
           Entrar como alumno
        </a>
      `
    });

    res.json({ ok: true, msg: "Invitación enviada correctamente" });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ ok: false, msg: "Error enviando correo" });
  }
};

// DELETE: Eliminar alumno
export const eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM alumnos WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Alumno no encontrado" });
    res.json({ ok: true, msg: "Alumno eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando alumno" });
  }
};

// PUT: Guardar ubicación del alumno
export const guardarUbicacion = async (req, res) => {
  try {
    const { matricula, lat, lng } = req.body;
    const result = await pool.query(
      `UPDATE alumnos
       SET lat_inicial = $1, lng_inicial = $2, ultima_actualizacion = CURRENT_TIMESTAMP
       WHERE matricula = $3
       RETURNING *`,
      [lat, lng, matricula]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ ok: false, msg: "Alumno no encontrado" });
    res.json({ ok: true, alumno: result.rows[0] });
  } catch (err) {
    console.error("Error guardando ubicación:", err);
    res.status(500).json({ ok: false, msg: "Error interno del servidor." });
  }
};

// POST: Login de alumno por matrícula
export const loginAlumno = async (req, res) => {
  try {
    const { matricula } = req.body;
    if (!matricula)
      return res.status(400).json({ ok: false, msg: "Falta la matrícula." });

    const result = await pool.query(
      "SELECT id, nombre, matricula FROM alumnos WHERE matricula = $1 LIMIT 1",
      [matricula]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ ok: false, msg: "Matrícula no encontrada." });

    const alumno = result.rows[0];
    req.session.alumno = {
      id: alumno.id,
      nombre: alumno.nombre,
      matricula: alumno.matricula
    };

    res.json({ ok: true, alumno: req.session.alumno });
  } catch (err) {
    console.error("Error en loginAlumno:", err);
    res.status(500).json({ ok: false, msg: "Error interno del servidor." });
  }
};
