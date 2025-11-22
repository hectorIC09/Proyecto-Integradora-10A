/*import pool from "../db.js";

// ===============================
// 1. Registrar alumno (SOLO BD, SIN MailJS)
// ===============================
export const crearAlumno = async (req, res) => {
    try {
        const { nombre, matricula, email } = req.body;

        if (!nombre || !matricula || !email)
            return res.json({ ok: false, msg: "Faltan datos" });

        // Guardar alumno en BD
        const result = await pool.query(
            `INSERT INTO alumnos (nombre, matricula, email)
             VALUES ($1, $2, $3) RETURNING *`,
            [nombre, matricula, email]
        );

        // Respuesta al frontend
        res.json({ ok: true, alumno: result.rows[0] });

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
*/

import pool from "../db.js";

// ===============================
// 1. Registrar alumno (SOLO BD, SIN MailJS)
// ===============================
export const crearAlumno = async (req, res) => {
    try {
        const { nombre, matricula, email } = req.body;

        if (!nombre || !matricula || !email)
            return res.json({ ok: false, msg: "Faltan datos" });

        // Guardar alumno en BD
        const result = await pool.query(
            `INSERT INTO alumnos (nombre, matricula, email, admin_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, matricula, email, req.session.user.id]  // ← Guardar quién lo registró
        );

        // Respuesta al frontend
        res.json({ ok: true, alumno: result.rows[0] });

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
// 3. Obtener lista de alumnos (DE TODOS, versión original)
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



// ======================================================
// ⭐ NUEVO: Obtener alumnos SOLO del admin logueado ⭐
// ======================================================
export const obtenerAlumnosPorAdmin = async (req, res) => {
    try {
        const adminId = req.session.user.id;

        const { rows } = await pool.query(
            `SELECT *
             FROM alumnos
             WHERE admin_id = $1
             ORDER BY id DESC`,
            [adminId]
        );

        res.json({ ok: true, alumnos: rows });

    } catch (error) {
        console.error(error);
        res.json({ ok: false, msg: "Error al obtener alumnos del admin" });
    }
};
///////////////////////////////////////////////////////////////////////////

// =======================================
// Login del Alumno
// =======================================
export const loginAlumno = async (req, res) => {
    const { email, matricula } = req.body;

    const { rows } = await pool.query(
        "SELECT * FROM alumnos WHERE email=$1 AND matricula=$2",
        [email, matricula]
    );

    if (rows.length === 0)
        return res.json({ ok: false, msg: "Datos incorrectos" });

    req.session.alumno = rows[0];

    res.json({ ok: true });
};


// =======================================
// Obtener datos del alumno logueado
// =======================================
export const alumnoActual = (req, res) => {
    if (!req.session.alumno)
        return res.json({ ok: false });

    res.json({ ok: true, alumno: req.session.alumno });
};

// =======================================
// Botón de pánico
// =======================================
export const activarPanico = async (req, res) => {
    if (!req.session.alumno)
        return res.json({ ok: false });

    await pool.query(
        "UPDATE alumnos SET en_alerta=true WHERE matricula=$1",
        [req.session.alumno.matricula]
    );

    res.json({ ok: true });
};
