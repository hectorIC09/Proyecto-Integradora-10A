import express from "express";
import {
  obtenerAlumnos,
  crearInvitacion,
  registrarDatosAlumno,
  actualizarUbicacion,
  eliminarAlumno,
  toggleAlerta
} from "../controllers/alumnosController.js";

const router = express.Router();

// Rutas API
router.get("/alumnos", obtenerAlumnos);               // Para llenar la tabla y mapa del admin
router.post("/alumnos/invitar", crearInvitacion);     // Paso 1: Admin crea hueco con email
router.post("/alumnos/registro", registrarDatosAlumno); // Paso 2: Alumno llena sus datos
router.post("/alumnos/ubicacion", actualizarUbicacion); // Paso 3: Alumno envía GPS
router.delete("/alumnos/:id", eliminarAlumno);        // Admin borra alumno
router.put("/alumnos/alerta/:id", toggleAlerta);      // Admin activa/desactiva alerta

export default router;