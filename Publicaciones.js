import express from 'express';
import upload from './multer.js';
import { pool } from './db.js';
import {verifyToken} from './middlewares.js';

const router = express.Router();

// Ruta para subir imagen + info
router.post('/Publicaciones', upload.single('imagen'), async (req, res) => {
  try {
    const Fotos = req.file.path;
    const { Pais, ProvinciaEstado, Direccion, Descripcion } = req.body;

    const result = await pool.query(
      'INSERT INTO public."Publicaciones" (Pais, ProvinciaEstado, Direccion, Descripcion, Fotos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [Pais, ProvinciaEstado, Direccion, Descripcion, Fotos]
    );

    res.status(201).json({
      message: 'Publicación creada correctamente',
      publicacion: result.rows[0],
    });
  } catch (error) {
    console.error('Error al subir la publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
