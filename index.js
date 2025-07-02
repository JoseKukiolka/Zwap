import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

import {
  createUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario,
  solicitarCodigo, 
  cambiarContrasenaConCodigo

} from "./Usuario.js";

// Ruta raíz - simple para testear servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Ruta para crear usuario (POST)
app.post("/usuarios", createUsuario);

// Ruta para eliminar usuario (DELETE)
app.delete("/Usuario", deleteUsuario);

//Actualizar usuario
app.put("/Usuario/:CorreoElectronico", updateUsuario);

//Inicio Sesion
app.post("/login", loginUsuario);

// Pedir codigo para cambiar la contraseña
app.post("/recuperar", solicitarCodigo);

//Cambiar la contraseña
app.post("/restablecer", cambiarContrasenaConCodigo);





const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
