/*import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: "clave-secreta-demo",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 min
}));

// Carpeta pública
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas API
app.use("/api", authRoutes);

// Datos de usuario logueado
app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.session.user });
});

// Dashboard
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

// --- 1. LÍNEA NUEVA ---
// Importamos las nuevas rutas de alumnos (asegúrate de incluir .js)
import alumnosRoutes from "./routes/alumnosRoutes.js"; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: "clave-secreta-demo",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 min
}));
export function soloAdmin(req, res, next) {
  const user = req.session && req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: "No autorizado" });
  }
  next();
}

// Carpeta pública
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas API
app.use("/api", authRoutes); // <- Esta es tu ruta de autenticación existente


// --- 2. LÍNEA NUEVA ---
// Le decimos a Express que también use las rutas de alumnos bajo el prefijo /api
app.use("/api", alumnosRoutes); 

// Datos de usuario logueado
app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.session.user });
});

// Dashboard
// Esta ruta protege tu dashboard.html
app.get("/dashboard", (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') return res.redirect("/");
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});