import express from 'express';
import upload from './multer.js'; 
import { verificarToken } from './authMiddleware.js';
import { pool } from './db.js';

const router = express.Router();

// Paso 1: Ubicación y tipo de propiedad
router.post('/publicaciones/paso1', verificarToken, async (req, res) => {
  try {
    const {
      Pais,
      ProvinciaEstado,
      CiudadLocalidad,
      CalleYNumero,
      TipoPropiedad
    } = req.body;

    const result = await pool.query(
      `INSERT INTO public."Publicaciones" 
      (Pais, ProvinciaEstado, CiudadLocalidad, CalleYNumero, TipoPropiedad) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [Pais, ProvinciaEstado, CiudadLocalidad, CalleYNumero, TipoPropiedad]
    );

    res.status(201).json({
      message: 'Paso 1 completado',
      publicacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error en paso 1:', error);
    res.status(500).json({ error: 'Error interno en paso 1' });
  }
});

// Paso 2: Características estructurales y descripción
router.put('/publicaciones/:id/paso2', verificarToken, async (req, res) => {
  try {
    const id = req.params.id;
    const {
      NumeroAmbientes,
      NumeroPisos,
      MetrosCuadrados,
      NombrePropiedad,
      BreveDescripcion
    } = req.body;

    const result = await pool.query(
      `UPDATE public."Publicaciones" SET
        NumeroAmbientes = $1,
        NumeroPisos = $2,
        MetrosCuadrados = $3,
        NombrePropiedad = $4,
        BreveDescripcion = $5
      WHERE id = $6 RETURNING *`,
      [
        NumeroAmbientes,
        NumeroPisos,
        MetrosCuadrados,
        NombrePropiedad,
        BreveDescripcion,
        id
      ]
    );

    res.status(200).json({
      message: 'Paso 2 completado',
      publicacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error en paso 2:', error);
    res.status(500).json({ error: 'Error interno en paso 2' });
  }
});

// Paso 3: Amenities
router.put('/publicaciones/:id/paso3', verificarToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { Amenities } = req.body; // amenities es un array de strings

    const result = await pool.query(
      `UPDATE public."Publicaciones" SET
        Amenities = $1
      WHERE id = $2 RETURNING *`,
      [Amenities, id]
    );

    res.status(200).json({
      message: 'Paso 3 completado',
      publicacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error en paso 3:', error);
    res.status(500).json({ error: 'Error interno en paso 3' });
  }
});

// Paso 4: Subida de imágenes a Cloudinary
router.put('/publicaciones/:id/paso4', verificarToken, upload.array('imagenes', 10), async (req, res) => {
  try {
    const id = req.params.id;
    const archivos = req.files;
    const urls = archivos.map(file => file.path); // path es la URL pública de Cloudinary

    const result = await pool.query(
      `UPDATE public."Publicaciones" SET
        Fotos = $1
      WHERE id = $2 RETURNING *`,
      [urls, id]
    );

    res.status(200).json({
      message: 'Paso 4 completado (Cloudinary)',
      publicacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error en paso 4:', error);
    res.status(500).json({ error: 'Error interno en paso 4' });
  }
});

export default router;
