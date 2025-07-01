import pkg from 'pg';
const { Client } = pkg;

//Conectar con Postgresql

export const client = new Client({
  user: 'postgres',           // o tu usuario
  host: 'localhost',
  database: 'postgres', // poné el mismo nombre que ves en pgAdmin
  password: 'Zwap',
  port: 5432,                 // puerto por defecto de PostgreSQL
});

client.connect()

  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));
