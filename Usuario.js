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

  if (!Nombre || !Apellido || !CorreoElectronico || !Contrasena) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    // Verificar si el correo ya existe
    const existente = await client.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (existente.rows.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(Contrasena, 10);

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
    res.status(500).json({ message: "Error al crear el usuario" });
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
  const { CorreoElectronico } = req.params; // ahora viene por la URL
  const {
    Nombre,
    Apellido,
    Dni,
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

    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    const update = await client.query(
      `UPDATE public."Usuario"
       SET "Nombre" = $1,
           "Apellido" = $2,
           "Dni" = $3,
           "NumeroTelefono" = $4,
           "Nacionalidad" = $5,
           "Pais" = $6,
           "ProvinciaEstado" = $7,
           "Ciudad" = $8,
           "Direccion" = $9,
           "Contrasena" = $10
       WHERE "CorreoElectronico" = $11
       RETURNING *`,
      [
        Nombre,
        Apellido,
        Dni,
        NumeroTelefono,
        Nacionalidad,
        Pais,
        ProvinciaEstado,
        Ciudad,
        Direccion,
        hashedPassword,
        CorreoElectronico
      ]
    );

    res.json({ message: "Usuario actualizado correctamente", usuario: update.rows[0] });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error del servidor al actualizar el usuario" });
  }
};
