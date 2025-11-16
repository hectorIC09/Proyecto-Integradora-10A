import pool from '../db.js';
import { Resend } from 'resend';

// Instancia global de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// =========================
// GET ALUMNOS
// =========================
export const getAlumnos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumnos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// =========================
// SET ALERTA
// =========================
export const setAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { en_alerta } = req.body;

    const result = await pool.query(
      "UPDATE alumnos SET en_alerta = $1 WHERE id = $2 RETURNING *",
      [en_alerta, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// =========================
// INVITAR ALUMNO (Resend)
// =========================
export const invitarAlumno = async (req, res) => {
  try {
    const { correo, matricula } = req.body;

    if (!correo || !matricula) {
      return res.status(400).json({ ok: false, msg: "Faltan datos" });
    }

    // Verificar si ya está registrado
    const existe = await pool.query(
      "SELECT * FROM alumnos WHERE matricula = $1",
      [matricula]
    );

    if (existe.rows.length > 0) {
      return res.json({ ok: false, msg: "El alumno ya está registrado" });
    }

    // Registrar alumno nuevo con rol "alumno"
    await pool.query(
      `INSERT INTO alumnos(nombre, matricula, telefono, lat_inicial, lng_inicial, rol)
       VALUES('Sin Nombre', $1, null, null, null, 'alumno')`,
      [matricula]
    );

    // LINK a la página de activación del alumno
    // (cuando tengas la página alumno.html esto ya funcionará directo)
    const linkAlumno = `https://proyecto-integradora-10a.onrender.com/alumno.html?matricula=${matricula}`;

    // Enviar correo con Resend
    await resend.emails.send({
      from: "Campus Watch <onboarding@resend.dev>",
      to: correo,
      subject: "Invitación a Campus Watch",
      html: `
        <h2>Bienvenido a Campus Watch</h2>
        <p>Has sido invitado a activar tu ubicación y usar el botón de pánico dentro del campus.</p>
        
        <p>Da clic en este enlace para ingresar:</p>

        <a href="${linkAlumno}"
           style="color:white; background:#2563eb; padding:12px 18px;
           border-radius:6px; text-decoration:none; display:inline-block;">
          Entrar como Alumno
        </a>

        <p style="margin-top:20px;">Si no reconoces este mensaje, ignóralo.</p>
      `
    });

    res.json({ ok: true, msg: "Invitación enviada correctamente" });

  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ ok: false, msg: "Error enviando correo" });
  }
};

// Obtener alumno por matrícula
export const getAlumnoByMatricula = async (req, res) => {
  try {
    const { matricula } = req.params;
    const result = await pool.query(
      "SELECT id, nombre, matricula, telefono, lat_actual, lng_actual, en_alerta FROM alumnos WHERE matricula = $1",
      [matricula]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Alumno no encontrado" });
    }

    res.json({ ok: true, alumno: result.rows[0] });
  } catch (err) {
    console.error("Error getAlumnoByMatricula:", err);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};
