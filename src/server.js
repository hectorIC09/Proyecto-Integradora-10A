import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import alumnosRoutes from "./routes/alumnosRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
//   🔧 MIDDLEWARE GLOBAL
// ==============================
app.use(bodyParser.json());
app.use(session({
  secret: "clave-secreta-demo",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 min
}));

// Middleware para verificar admins
export function soloAdmin(req, res, next) {
  const user = req.session && req.session.user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "No autorizado" });
  }
  next();
}

// ==============================
//   🔵 1. RUTAS API
// ==============================

// Datos de usuario logueado (DEBE ir antes de express.static)
app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.session.user });
});

// Auth
app.use("/api", authRoutes);

// Alumnos (protegida)
app.use("/api/alumnos", soloAdmin, alumnosRoutes);

// ==============================
//   🔵 2. ARCHIVOS PÚBLICOS
// ==============================
app.use(express.static(path.join(__dirname, "..", "public")));

// ==============================
//   🔵 3. DASHBOARD (protegido)
// ==============================
app.get("/dashboard", soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

// ==============================
//   🚀 Servidor
// ==============================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
