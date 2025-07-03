import express from "express";
import cors from "cors";

import {
  createUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario,
  solicitarCodigo, 
  cambiarContrasenaConCodigo
} from "./Usuario.js";

import publicacionesRouter from './Publicaciones.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', publicacionesRouter);

// Ruta raíz - simple para testear servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Ruta para crear usuario (POST)
app.post("/usuarios", createUsuario);

// Ruta para eliminar usuario (DELETE)
app.delete("/Usuario", deleteUsuario);

// Actualizar usuario
app.put("/Usuario/:CorreoElectronico", updateUsuario);

// Inicio Sesión
app.post("/login", loginUsuario);

// Pedir código para cambiar la contraseña
app.post("/recuperar", solicitarCodigo);

// Cambiar la contraseña
app.post("/restablecer", cambiarContrasenaConCodigo);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
