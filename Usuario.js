import { client } from "./db.js";

// Crear un Usuario

const createUsuario =  async (req, res) => {
    const { Nombre, Apellido, Dni, NumeroTelefono, Nacionalidad, Pais, ProvinciaEstado, Ciudad, Direccion } = req.body;
    const { rows } = await client.query(
        `INSERT INTO public."Usuario" 
        ("Nombre", "Apellido", "Dni", "CorreoElectronico", "NumeroTelefono", "Nacionalidad", "Pais", "ProvinciaEstado", "Ciudad", "Direccion") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`, // Asegúrate de que las columnas y los valores coincidan
        [Nombre, Apellido, Dni, NumeroTelefono, Nacionalidad, Pais, ProvinciaEstado, Ciudad, Direccion]
    );
        

}
