import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import alumnosRoutes from "./routes/alumnosRoutes.js";   // <-- IMPORTANTE

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
  cookie: { maxAge: 1000 * 60 * 30 }
}));

export function soloAdmin(req, res, next) {
  const user = req.session && req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: "No autorizado" });
  }
  next();
}

// ==============================
//   🔵 1. RUTAS API (Primero)
// ==============================
app.use("/api", authRoutes);
app.use("/api/alumnos", alumnosRoutes);   // <-- AQUI ESTÁ LA RUTA FALTANTE

// ==============================
//   🔵 2. Carpeta pública
// ==============================
app.use(express.static(path.join(__dirname, "..", "public")));

// Datos de usuario logueado
app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.session.user });
});

// Dashboard
app.get("/dashboard", (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') return res.redirect("/");
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
