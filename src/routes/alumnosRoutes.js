/*import express from "express";
import { crearAlumno, actualizarUbicacion, obtenerAlumnos } from "../controllers/alumnosController.js";

const router = express.Router();

// Registrar alumno desde el dashboard
router.post("/create", crearAlumno);

// Obtener todos los alumnos (para el dashboard)
router.get("/", obtenerAlumnos);

// Alumno envía su ubicación
router.post("/ubicacion", actualizarUbicacion);


export default router;*/

import express from "express";
import { 
  crearAlumno, 
  actualizarUbicacion, 
  obtenerAlumnos, 
  obtenerAlumnosPorAdmin,
  loginAlumno,
  alumnoActual,
  activarPanico
} from "../controllers/alumnosController.js";
import { soloAdmin } from "../server.js";


const router = express.Router();

// Registrar alumno desde el dashboard
router.post("/create",soloAdmin, crearAlumno);

// Obtener TODOS los alumnos (para el dashboard)
router.get("/", soloAdmin,obtenerAlumnos);

// Alumno envía su ubicación
router.post("/ubicacion", actualizarUbicacion);

// Alumnos creados por ESTE admin
router.get("/mis-alumnos",soloAdmin, obtenerAlumnosPorAdmin);

//////////////////////////////////////////

router.post("/login", loginAlumno);
router.get("/me", alumnoActual);
router.post("/alerta", toggleAlerta);


export default router;

