import express from 'express';
import upload from './multer.js';
import { pool } from './db.js';

const router = express.Router();

// Ruta para subir imagen + info
router.post('/Publicaciones', upload.single('imagen'), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    const { titulo, descripcion } = req.body;

    const result = await pool.query(
      'INSERT INTO public."Publicaciones" (titulo, descripcion, imagen_url) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descripcion, imageUrl]
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
