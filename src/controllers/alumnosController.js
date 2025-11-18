import db from "../config/db.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// =============================
//       GET ALUMNOS
// =============================
export const getAlumnos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM alumnos");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// =============================
//   GET POR MATRICULA
// =============================
export const getAlumnoPorMatricula = async (req, res) => {
  const { matricula } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM alumnos WHERE matricula = ?",
      [matricula]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Alumno no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// =============================
//   ALERTA ON/OFF
// =============================
export const setAlerta = async (req, res) => {
  const { id } = req.params;
  const { en_alerta } = req.body;

  try {
    await db.query(
      "UPDATE alumnos SET en_alerta = ? WHERE id = ?",
      [en_alerta, id]
    );

    res.json({ ok: true, message: "Alerta actualizada" });
  } catch (err) {
    console.error("Error en alerta:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// =============================
//   INVITAR ALUMNO + EMAIL
// =============================
export const invitarAlumno = async (req, res) => {
  const { nombre, email, matricula } = req.body;

  if (!email || !matricula)
    return res.status(400).json({
      ok: false,
      message: "Email y matrícula obligatorios"
    });

  try {
    // Guardar alumno si no existe
    await db.query(
      `INSERT INTO alumnos (nombre, email, matricula, lat_inicial, lng_inicial)
       VALUES (?, ?, ?, NULL, NULL)`,
      [nombre || "Alumno", email, matricula]
    );

    // ✉ Enviar correo con Resend
    const { error } = await resend.emails.send({
      from: "Campus Watch <onboarding@resend.dev>",  // ESTE SI FUNCIONA EN RENDER
      to: email,
      subject: "Invitación a Campus Watch",
      html: `
        <h2>Bienvenido a Campus Watch</h2>
        <p>Has sido invitado a registrarte.</p>
        <p>Tu matrícula: <strong>${matricula}</strong></p>
        <p>Ingresa a la app y permite tu ubicación.</p>
      `,
    });

    if (error) {
      console.error("Error enviando correo:", error);
      return res.status(500).json({
        ok: false,
        message: "No se pudo enviar el correo"
      });
    }

    res.json({ ok: true, message: "Invitación enviada" });

  } catch (err) {
    console.error("Error en invitación:", err);
    res.status(500).json({ ok: false, message: "Error interno" });
  }
};

// =============================
//   ACTUALIZAR UBICACION
// =============================
export const actualizarUbicacion = async (req, res) => {
  const { matricula, lat, lng } = req.body;

  if (!matricula || !lat || !lng)
    return res.status(400).json({ message: "Datos incompletos" });

  try {
    await db.query(
      "UPDATE alumnos SET lat_actual = ?, lng_actual = ? WHERE matricula = ?",
      [lat, lng, matricula]
    );

    res.json({ ok: true, message: "Ubicación actualizada" });
  } catch (err) {
    console.error("Error ubicación:", err);
    res.status(500).json({ ok: false });
  }
};

// =============================
//   ELIMINAR ALUMNO
// =============================
export const eliminarAlumno = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM alumnos WHERE id = ?", [id]);
    res.json({ ok: true, message: "Alumno eliminado" });
  } catch (err) {
    console.error("Error eliminando:", err);
    res.status(500).json({ ok: false });
  }
};
