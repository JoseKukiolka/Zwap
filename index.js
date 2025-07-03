import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  createUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario,
  solicitarCodigo,
  cambiarContrasenaConCodigo,
} from "./Usuario.js";

import publicacionesRouter from "./Publicaciones.js"; // ✅ Importación corregida

dotenv.config();

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

// Ruta para crear usuario
app.post("/usuarios", createUsuario);

// Ruta para eliminar usuario
app.delete("/usuarios", deleteUsuario);

// Actualizar usuario
app.put("/usuarios/:CorreoElectronico", updateUsuario);

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
