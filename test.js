// test.js
import { pool } from './db.js';

async function probarConsulta() {
  try {
    const resultado = await pool.query('SELECT * FROM public."Usuario"');
    console.log("Usuarios en la tabla:");
    console.table(resultado.rows);
  } catch (error) {
    console.error("Error en la consulta:", error);
  } finally {
    await pool.end(); // cerramos la conexión
  }
}

probarConsulta();