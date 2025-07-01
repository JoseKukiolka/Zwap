import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import {
  createUsuario,
  deleteUsuario
} from "./Usuario.js";

// Ruta raíz - simple para testear servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Ruta para crear usuario (POST)
app.post("/usuarios", createUsuario);

// Ruta para eliminar usuario (DELETE)
app.delete("/usuarios/:dni", deleteUsuario);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
