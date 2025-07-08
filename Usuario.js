import bcrypt from 'bcrypt';
import { pool } from './db.js';
import nodemailer from 'nodemailer';
<<<<<<< HEAD
import jwt from 'jsonwebtoken';
=======
import jwt from "jsonwebtoken";
>>>>>>> 8ee9b2a8ad0d8c4d225570c67a66fa5d8a229422
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.API_KEY;
console.log(apiKey);

const token = process.env.API_TOKEN;

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
    const existente = await pool.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (existente.rows.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    const { rows } = await pool.query(
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
    const result = await pool.query(
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

    await pool.query(
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
  const { CorreoElectronico } = req.params;  // viene por URL
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
    const result = await pool.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    const update = await pool.query(
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

//Registrarse

// export const register = async (req, res) => {
//   try {
//     console.log(req.body)
//     const { Nombre, Apellido, Pais, Dni, FechaNacimiento, CorreoElectronico, Contraseña } = req.body;
//     if (!Nombre || !Apellido || !Pais || !Dni || !FechaNacimiento || !CorreoElectronico || !Contraseña) return res.status(400).send("Falta completar campos");
//     const usuarioExiste = await getUsuario(CorreoElectronico)
//     if (usuarioExiste) return res.status(400).json({ message: `Usuario con Correo Electronico ${CorreoElectronico} ya existe`, user: usuarioExiste });
//     console.log(
//       Nombre,
//       Apellido,
//       CorreoElectronico
//     );
//     const passwordHashed = await bcrypt.hash(Contraseña, 10);
//     const GuardarUsuario = await createUsuario(Nombre,
//       Apellido, 
//       Dni, 
//       CorreoElectronico, 
//       Contraseña, 
//       NumeroTelefono, 
//       Nacionalidad, 
//       Pais,
//       ProvinciaEstado,
//       Ciudad, 
//       Direccion);
//     return res.status(201).json({ message: "Usuario registrado correctamente" });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error durante la creación del usuario" });
//   }

// };


//Inicio Sesion

export const loginUsuario = async (req, res) => {
  const { CorreoElectronico, Contrasena } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const usuario = result.rows[0];
    const passMatch = await bcrypt.compare(Contrasena, usuario.Contrasena);

    if (!passMatch) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

<<<<<<< HEAD
    const token = jwt.sign(
      {
        id: usuario.id,
        CorreoElectronico: usuario.CorreoElectronico
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token: token
    });
=======
    const token = jwt.sign({ CorreoElectronico: usuario.CorreoElectronico }, process.env.JWT_SECRET, { expiresIn: '50m' });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      usuario: {
        CorreoElectronico: usuario.CorreoElectronico,
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido
      },
      token: token
    });
  } catch (error) {
    console.log(error)
    res.status(500).send("Error en el proceso de inicio de sesión");
  }
  try {

    // 3. Login exitoso - devolver datos o token
    res.json({
      message: "Inicio de sesión exitoso", usuario: {
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido,
        CorreoElectronico: usuario.CorreoElectronico,
      }
    });
>>>>>>> 8ee9b2a8ad0d8c4d225570c67a66fa5d8a229422
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};


// Recuperar / Cambiar contraseña

export const solicitarCodigo = async (req, res) => {
  const { CorreoElectronico } = req.body;

  try {
    // Verificamos que el usuario exista
    const result = await pool.query(
      `SELECT * FROM public."Usuario" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    // Crear código aleatorio
    const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Ej: 6 dígitos
    const expira = new Date(Date.now() + 10 * 60000); // 10 minutos

    // Guardar o actualizar en la tabla Recuperacion
    await pool.query(`
      INSERT INTO "Recuperacion" ("CorreoElectronico", "Codigo", "Expira")
      VALUES ($1, $2, $3)
      ON CONFLICT ("CorreoElectronico")
      DO UPDATE SET "Codigo" = $2, "Expira" = $3
    `, [CorreoElectronico, codigo, expira]);

    // Enviar correo con código

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: 'tuCorreo@gmail.com',
      to: CorreoElectronico,
      subject: 'Código para restablecer tu contraseña',
      text: `Tu código de recuperación es: ${codigo}`
    });

    res.json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error al enviar el código:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const cambiarContrasenaConCodigo = async (req, res) => {
  const { CorreoElectronico, Codigo, NuevaContrasena } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM "Recuperacion" WHERE "CorreoElectronico" = $1`,
      [CorreoElectronico]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "No se solicitó código para este correo" });
    }

    const { Codigo: codigoDB, Expira } = result.rows[0];

    if (codigoDB !== Codigo) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    if (new Date() > new Date(Expira)) {
      return res.status(400).json({ message: "Código expirado" });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(NuevaContrasena, 10);

    // Actualizar contraseña
    await pool.query(`
      UPDATE "Usuario"
      SET "Contrasena" = $1
      WHERE "CorreoElectronico" = $2
    `, [hashedPassword, CorreoElectronico]);

    // Eliminar código de recuperación
    await pool.query(`DELETE FROM "Recuperacion" WHERE "CorreoElectronico" = $1`, [CorreoElectronico]);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};