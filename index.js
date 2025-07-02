import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

import {
  createUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario

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



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
