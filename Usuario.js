import bcrypt from 'bcrypt';
import { client } from './db.js';

// Crear Usuario
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

  if (!Nombre || !Apellido || !Dni || !CorreoElectronico || !Contrasena) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
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
        hashedPassword,
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
    if (error.code === '23505') {
      res.status(409).json({ message: "El DNI o correo ya están registrados" });
    } else {
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  }
};

// Eliminar Usuario
export const deleteUsuario = async (req, res) => {
  const { CorreoElectronico, Contrasena } = req.body;

  try {
    const result = await client.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    const esValida = await bcrypt.compare(Contrasena, usuario.Contrasena);

    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

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

// Actualizar Usuario
export const updateUsuario = async (req, res) => {
  const { dni } = req.params; // Recibir dni como parámetro en la ruta
  const {
    Nombre,
    Apellido,
    CorreoElectronico,
    NumeroTelefono,
    Nacionalidad,
    Pais,
    ProvinciaEstado,
    Ciudad,
    Direccion,
    Contrasena
  } = req.body;

  try {
    const result = await client.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const update = await client.query(
      `UPDATE public."Usuario"
       SET "Nombre" = $1,
           "Apellido" = $2,
           "Dni" = $3,
           "CorreoElectronico" = $4,
           "NumeroTelefono" = $5,
           "Nacionalidad" = $6,
           "Pais" = $7,
           "ProvinciaEstado" = $8,
           "Ciudad" = $9,
           "Direccion" = $10,
           "Contrasena"= $11
       WHERE "CorreoElectronico" = $12
       RETURNING *`,
      [
        Nombre,
        Apellido,
        Dni,
        CorreoElectronico,
        NumeroTelefono,
        Nacionalidad,
        Pais,
        ProvinciaEstado,
        Ciudad,
        Direccion,
        Contrasena
      ]
    );

    res.json({ message: "Usuario actualizado correctamente", usuario: update.rows[0] });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error del servidor al actualizar el usuario" });
  }
};
