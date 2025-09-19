import express from "express";
import { pool } from "./db.js";
import { verifyToken } from "./authMiddleware.js";

const router = express.Router();

// Agregar publicación a favoritos
router.post("/favoritos/:publicacionId", verifyToken, async (req, res) => {
  const correo = req.user.CorreoElectronico; // viene del token
  const { publicacionId } = req.params;

  try {
    const result = await pool.query(
      `INSERT INTO public."Favoritos" ("CorreoElectronico", "PublicacionId")
       VALUES ($1, $2)
       ON CONFLICT ("CorreoElectronico", "PublicacionId") DO NOTHING
       RETURNING *`,
      [correo, publicacionId]
    );

    res.status(201).json({
      message: "Publicación agregada a favoritos",
      favorito: result.rows[0] || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar a favoritos" });
  }
});

// Quitar publicación de favoritos
router.delete("/favoritos/:publicacionId", verifyToken, async (req, res) => {
  const correo = req.user.CorreoElectronico;
  const { publicacionId } = req.params;

  try {
    await pool.query(
      `DELETE FROM public."Favoritos"
       WHERE "CorreoElectronico" = $1 AND "PublicacionId" = $2`,
      [correo, publicacionId]
    );

    res.json({ message: "Publicación removida de favoritos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al quitar favorito" });
  }
});

// Listar favoritos de un usuario
router.get("/favoritos", verifyToken, async (req, res) => {
  const correo = req.user.CorreoElectronico;

  try {
    const result = await pool.query(
      `SELECT p.*
       FROM public."Publicaciones" p
       JOIN public."Favoritos" f
         ON p."id" = f."PublicacionId"
       WHERE f."CorreoElectronico" = $1
       ORDER BY f."FechaAgregado" DESC`,
      [correo]
    );

    res.json({ favoritos: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

export default router;
