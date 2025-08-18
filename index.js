import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js"; // 👈 Importar conexión a Neon

import {
  createUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario,
  solicitarCodigo,
  cambiarContrasenaConCodigo,
} from "./Usuario.js";

import publicacionesRouter from "./Publicaciones.js";

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

// /api para las rutas de publicaciones
app.use("/api", publicacionesRouter); // ✅ Solo una vez

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Crear usuario
app.post("/usuarios", createUsuario);

// Eliminar usuario (body JSON con CorreoElectronico y Contrasena)
app.delete("/Usuario", deleteUsuario);

// Actualizar usuario por CorreoElectronico
app.put("/Usuario/:CorreoElectronico", updateUsuario);

// Inicio Sesión
app.post("/login", loginUsuario);

// Recuperar contraseña
app.post("/recuperar", solicitarCodigo);

// Restablecer contraseña
app.post("/restablecer", cambiarContrasenaConCodigo);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
