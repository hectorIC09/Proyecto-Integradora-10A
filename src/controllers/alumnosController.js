import pool from "../db.js";


// ===============================
// 1. Registrar alumno + enviar correo
// ===============================
export const crearAlumno = async (req, res) => {
    try {
        const { nombre, matricula, email } = req.body;

        if (!nombre || !matricula || !email)
            return res.json({ ok: false, msg: "Faltan datos" });

        // Guardar en BD
        const result = await pool.query(
            `INSERT INTO alumnos (nombre, matricula, email)
             VALUES ($1, $2, $3) RETURNING *`,
            [nombre, matricula, email]
        );

        // === Enviar invitación con MailJS ===
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: "service_tqq2bv2",
                template_id: "template_oqgl00e",
                user_id: "0HprKapko61rkW7zp",
                template_params: {
                    alumno_nombre: nombre,
                    alumno_matricula: matricula,

                    // 🔥 Este es el link que se usará en tu template MailJS
                    link: `https://proyecto-integradora-10a.onrender.com/ubicacion.html?matricula=${matricula}`
                }
            })
        });

        res.json({ ok: true, msg: "Alumno registrado y correo enviado" });

    } catch (error) {
        console.error(error);
        res.json({ ok: false, msg: "Error en el servidor" });
    }
};

// ===============================
// 2. Alumno actualiza ubicación
// ===============================
export const actualizarUbicacion = async (req, res) => {
    try {
        const { matricula, lat, lng } = req.body;

        await pool.query(
            `UPDATE alumnos 
             SET lat=$1, lng=$2, ultima_ubicacion=NOW()
             WHERE matricula=$3`,
            [lat, lng, matricula]
        );

        res.json({ ok: true, msg: "Ubicación actualizada" });

    } catch (error) {
        console.error(error);
        res.json({ ok: false, msg: "Error al actualizar ubicación" });
    }
};

// ===============================
// 3. Obtener lista de alumnos
// ===============================
export const obtenerAlumnos = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM alumnos ORDER BY id DESC`
        );

        res.json({ ok: true, alumnos: rows });

    } catch (error) {
        console.error(error);
        res.json({ ok: false, msg: "Error al obtener alumnos" });
    }
};
