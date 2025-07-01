import { client } from "./db.js";

//Subir una publicacion

export const createPublicacion = async (req, res) => {
    try {
      const {
        Pais,
        ProvinciaEstado,
        Ciudad,
        Direccion,
        Fotos,
        InfoAdicional
      } = req.body;
  
      // Validación de campos obligatorios
      if (!Pais || !ProvinciaEstado || !Direccion || !Fotos) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }
  
      const { rows } = await client.query(
        `INSERT INTO public."Publicaciones" 
        ("Pais", "ProvinciaEstado", "Ciudad", "Direccion", "Fotos", "InfoAdicional") 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [Pais, ProvinciaEstado, Ciudad, Direccion, Fotos, InfoAdicional]
      );
  
      res.status(201).json({
        message: "Publicación creada correctamente",
        publicacion: rows[0]
      });
  
    } catch (error) {
      console.error("Error al crear la Publicación:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  
  