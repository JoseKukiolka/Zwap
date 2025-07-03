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

import publicacionesRouter from "./Publicaciones.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", publicacionesRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.post("/usuarios", createUsuario);
app.delete("/usuarios", deleteUsuario);
app.put("/usuarios/:CorreoElectronico", updateUsuario);
app.post("/login", loginUsuario);
app.post("/recuperar", solicitarCodigo);
app.post("/restablecer", cambiarContrasenaConCodigo);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
