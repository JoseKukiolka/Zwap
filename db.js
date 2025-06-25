import pkg from 'pg';
const { Client } = pkg;

//Conectar con Postgresql

export const client = new Client({
  user: 'postgres',           // o tu usuario
  host: 'localhost',
  database: 'nombre_de_tu_base', // poné el mismo nombre que ves en pgAdmin
  password: 'tu_contraseña',
  port: 5432,                 // puerto por defecto de PostgreSQL
});

client.connect();
