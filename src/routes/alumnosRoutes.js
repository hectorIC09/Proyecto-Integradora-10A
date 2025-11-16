import express from 'express';
const router = express.Router();

// Importamos TODOS los métodos del controller
import { 
  getAlumnos, 
  setAlerta,
  invitarAlumno
} from '../controllers/alumnosController.js';

// Obtener todos los alumnos
router.get('/alumnos', getAlumnos);

// Actualizar el estado de alerta
router.put('/alumnos/alerta/:id', setAlerta);

// Invitar alumno por correo
router.post('/alumnos/invitar', invitarAlumno);

export default router;
