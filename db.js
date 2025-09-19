// db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // carga variables de .env

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // tu URL completa de Neon
  ssl: { rejectUnauthorized: false } // 🔑 necesario para Neon Cloud
});

// Probar la conexión al iniciar
pool.connect()
  .then(() => console.log("✅ Conectado a Neon Cloud correctamente"))
  .catch(err => console.error("❌ Error conectando a Neon Cloud:", err));

export { pool };
