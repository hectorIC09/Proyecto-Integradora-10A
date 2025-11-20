import express from "express";
import {
  getAlumnos,
  invitarAlumno,
  completarRegistro, // Nueva función
  guardarUbicacion,
  eliminarAlumno
} from "../controllers/alumnosController.js";

const router = express.Router();

router.get("/alumnos", getAlumnos);
router.post("/alumnos/invitar", invitarAlumno);
router.post("/alumnos/registro", completarRegistro); // Ruta nueva para el formulario
router.post("/alumnos/ubicacion", guardarUbicacion);
router.delete("/alumnos/:id", eliminarAlumno);

export default router;