import express from "express";
import upload from "./multer.js";
import { verifyToken } from "./authMiddleware.js"; // cambio a verifyToken
import { pool } from "./db.js";

const router = express.Router();

// Crear publicación en un solo paso
router.post("/publicaciones", verifyToken, upload.array("imagenes", 10), async (req, res) => {
  try {
    const {
      Pais,
      ProvinciaEstado,
      CiudadLocalidad,
      CalleYNumero,
      TipoPropiedad,
      NumeroAmbientes,
      NumeroPisos,
      MetrosCuadrados,
      NombrePropiedad,
      BreveDescripcion,
      Amenities // array de strings
    } = req.body;

    // URLs de Cloudinary
    const urls = req.files.map(file => file.path);

    const result = await pool.query(
      `INSERT INTO public."Publicaciones" 
      (Pais, ProvinciaEstado, CiudadLocalidad, CalleYNumero, TipoPropiedad, 
       NumeroAmbientes, NumeroPisos, MetrosCuadrados, NombrePropiedad, BreveDescripcion, Amenities, Fotos) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) 
      RETURNING *`,
      [
        Pais,
        ProvinciaEstado,
        CiudadLocalidad,
        CalleYNumero,
        TipoPropiedad,
        NumeroAmbientes,
        NumeroPisos,
        MetrosCuadrados,
        NombrePropiedad,
        BreveDescripcion,
        Amenities ? JSON.parse(Amenities) : null,
        urls
      ]
    );

    res.status(201).json({
      message: "Publicación creada con éxito",
      publicacion: result.rows[0]
    });
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    res.status(500).json({ error: "Error interno al crear publicación" });
  }
});

export default router;
