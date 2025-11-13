import express from 'express';
const router = express.Router();

// Importamos el NUEVO controlador de alumnos
// ¡Usamos .js en la importación porque estás en ES Modules!
import { getAlumnos, setAlerta } from '../controllers/alumnosController.js';

// --- Definimos las rutas ---
// El frontend llamará a GET /api/alumnos
router.get('/alumnos', getAlumnos);

// El frontend llamará a PUT /api/alumnos/alerta/:id
router.put('/alumnos/alerta/:id', setAlerta);

export default router;