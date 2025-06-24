import { client } from "./db.js";

// Crear un Usuario

import bcrypt from 'bcrypt';
import { client } from './db.js'; // tu conexión a PostgreSQL

export const createUsuario = async (req, res) => {
  const {
    Nombre,
    Apellido,
    Dni,
    CorreoElectronico,
    Contrasena,
    NumeroTelefono,
    Nacionalidad,
    Pais,
    ProvinciaEstado,
    Ciudad,
    Direccion
  } = req.body;

  try {
    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Contrasena, saltRounds);

    const { rows } = await client.query(
      `INSERT INTO public."Usuario" 
      ("Nombre", "Apellido", "Dni", "Contrasena", "CorreoElectronico", "NumeroTelefono", "Nacionalidad", "Pais", "ProvinciaEstado", "Ciudad", "Direccion") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        Nombre,
        Apellido,
        Dni,
        hashedPassword, // Guardás la contraseña ya hasheada
        CorreoElectronico,
        NumeroTelefono,
        Nacionalidad,
        Pais,
        ProvinciaEstado,
        Ciudad,
        Direccion
      ]
    );

    res.status(201).json({ message: "Usuario creado correctamente", usuario: rows[0] });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};


  //Eliminar Usuario

  import bcrypt from 'bcrypt';
import { client } from './db.js';

export const deleteUsuario = async (req, res) => {
  const { CorreoElectronico, Contrasena } = req.body;

  try {
    // 1. Buscar usuario por correo
    const result = await client.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    const usuario = result.rows[0];

    // 2. Verificar si existe
    if (!usuario) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    // 3. Comparar la contraseña ingresada con el hash guardado
    const esValida = await bcrypt.compare(Contrasena, usuario.Contrasena);

    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 4. Si la contraseña es válida, eliminar el usuario
    await client.query(
      `DELETE FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error del servidor al intentar eliminar el usuario" });
  }
};

