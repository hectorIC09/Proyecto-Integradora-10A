import express from "express";
import {
  getAlumnos,
  getAlumnoPorMatricula,
  setAlerta,
  invitarAlumno,
  eliminarAlumno
} from "../controllers/alumnosController.js";

const router = express.Router();

// Obtener todos los alumnos
router.get("/alumnos", getAlumnos);

// Obtener alumno por matrícula
router.get("/alumnos/matricula/:matricula", getAlumnoPorMatricula);

// Activar / desactivar alerta
router.put("/alumnos/alerta/:id", setAlerta);

// Invitar alumno (envía correo)
router.post("/alumnos/invitar", invitarAlumno);

// Eliminar alumno
router.delete("/alumnos/:id", eliminarAlumno);

export default router;
