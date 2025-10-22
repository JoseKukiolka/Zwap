import express from "express";
import { pool } from "./db.js";
import { verifyToken } from "./authMiddleware.js";

const router = express.Router();

// ✅ Crear una reseña (usuario autenticado)
router.post("/reseñas/:publicacionId", verifyToken, async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const { Puntaje, Comentario } = req.body;
    const correo = req.user.CorreoElectronico; // viene del token

    if (!Puntaje || !Comentario) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar que el usuario no haya dejado una reseña ya
    const check = await pool.query(
      `SELECT * FROM Reseñas WHERE CorreoElectronico = $1 AND PublicacionId = $2`,
      [correo, publicacionId]
    );

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya dejaste una reseña en esta publicación" });
    }

    // Insertar la nueva reseña
    const result = await pool.query(
      `INSERT INTO Reseñas (CorreoElectronico, PublicacionId, Puntaje, Comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [correo, publicacionId, Puntaje, Comentario]
    );

    res.status(201).json({
      mensaje: "Reseña creada correctamente",
      reseña: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Obtener todas las reseñas de una publicación
router.get("/reseñas/:publicacionId", async (req, res) => {
  try {
    const { publicacionId } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.Nombre, u.Apellido
       FROM Reseñas r
       JOIN Usuario u ON r.CorreoElectronico = u.CorreoElectronico
       WHERE r.PublicacionId = $1
       ORDER BY r.FechaCreacion DESC`,
      [publicacionId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
