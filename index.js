import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js"; // 👈 Conexión a Neon

// Importaciones de funciones de Usuario
import {
  createUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario,
  solicitarCodigo,
  cambiarContrasenaConCodigo,
} from "./Usuario.js";

// Importar routers
import publicacionesRouter from "./Publicaciones.js";
import favoritosRouter from "./Favoritos.js";
import reseñasRouter from "./Reseñas.js"; // 👈 Nuevo router de Reseñas

dotenv.config();

// 🔎 Debug: mostrar si se cargó DATABASE_URL
console.log("DATABASE_URL:", process.env.DATABASE_URL || "No definida");

// ✅ Test de conexión a Neon
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a Neon:", err);
  } else {
    console.log("✅ Conexión exitosa a Neon:", res.rows);
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rutas principales
app.use("/api", publicacionesRouter); // Publicaciones
app.use("/api", favoritosRouter);     // Favoritos
app.use("/api", reseñasRouter);       // 👈 Reseñas

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// ✅ Usuarios
app.post("/usuarios", createUsuario);
app.delete("/Usuario", deleteUsuario);
app.put("/Usuario/:CorreoElectronico", updateUsuario);
app.post("/login", loginUsuario);

// ✅ Recuperar y restablecer contraseña
app.post("/recuperar", solicitarCodigo);
app.post("/restablecer", cambiarContrasenaConCodigo);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
