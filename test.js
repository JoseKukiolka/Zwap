// test.js
import { client } from './db.js';

async function probarConsulta() {
  try {
    const resultado = await client.query('SELECT * FROM public."Usuario"');
    console.log("Usuarios en la tabla:");
    console.table(resultado.rows);
  } catch (error) {
    console.error("Error en la consulta:", error);
  } finally {
    await client.end(); // cerramos la conexión
  }
}

probarConsulta();