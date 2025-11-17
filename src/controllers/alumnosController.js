import pool from "../db.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ========================================
// GET: Todos los alumnos
// ========================================
export const getAlumnos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alumnos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo alumnos" });
  }
};

// ========================================
// GET: Alumno por matrícula
// ========================================
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

// ========================================
// PUT: Activar / desactivar alerta
// ========================================
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

// ========================================
// POST: Enviar invitación por correo
// ========================================
export const invitarAlumno = async (req, res) => {
  try {
    const { correo, matricula } = req.body;

    if (!correo || !matricula)
      return res.status(400).json({ ok: false, msg: "Faltan datos" });

    // Verificar si ya existe
    const existe = await pool.query(
      "SELECT * FROM alumnos WHERE matricula = $1",
      [matricula]
    );

    if (existe.rows.length > 0)
      return res.json({ ok: false, msg: "La matrícula ya existe" });

    // Registrar alumno
    await pool.query(
      `INSERT INTO alumnos(nombre, matricula, telefono, lat_inicial, lng_inicial, en_alerta)
       VALUES('Sin Nombre', $1, null, null, null, false)`,
      [matricula]
    );

    // Enviar correo con enlace
    await resend.emails.send({
      from: "Campus Watch <onboarding@resend.dev>",
      to: correo,
      subject: "Invitación a Campus Watch",
      html: `
        <h2>Bienvenido a Campus Watch</h2>
        <p>Activa tu cuenta en el siguiente enlace:</p>
        <a href="https://proyecto-integradora-10a.onrender.com/alumno.html?matricula=${matricula}"
           style="background:#007bff;color:white;padding:10px 20px;border-radius:5px;">
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

// ========================================
// DELETE: Eliminar alumno
// ========================================
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
