  import pool from '../db.js';
  import nodemailer from "nodemailer";

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
  // INVITAR ALUMNO
  // =========================
  export const invitarAlumno = async (req, res) => {
    try {
      const { correo, matricula } = req.body;

      if (!correo || !matricula) {
        return res.status(400).json({ ok: false, msg: "Faltan datos" });
      }

      const existe = await pool.query(
        "SELECT * FROM alumnos WHERE matricula = $1",
        [matricula]
      );

      if (existe.rows.length > 0) {
        return res.json({ ok: false, msg: "El alumno ya está registrado" });
      }

      await pool.query(
        `INSERT INTO alumnos(nombre, matricula, telefono, lat_inicial, lng_inicial)
        VALUES('Sin Nombre', $1, null, null, null)`,
        [matricula]
      );

     const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
     auth: {
     user: process.env.SMTP_EMAIL,
     pass: process.env.SMTP_PASS
     },
     });


      await transporter.sendMail({
        from: "Campus Watch <no-reply@campuswatch.com>",
        to: correo,
        subject: "Invitación a Campus Watch",
        html: `
          <h2>Bienvenido a Campus Watch</h2>
          <p>Activa tu ubicación en este enlace:</p>
          <a href="https://tu-dominio.com/rastreo?matricula=${matricula}">
            Activar rastreo
          </a>
        `
      });

      res.json({ ok: true, msg: "Invitación enviada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, msg: "Error del servidor" });
    }
  };
