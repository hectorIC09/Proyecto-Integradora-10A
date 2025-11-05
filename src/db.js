// db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Configura el pool de conexiones de PostgreSQL.
const pool = new pg.Pool({
    // Render expone la conexión en DATABASE_URL
    connectionString: process.env.DATABASE_URL, 
    
    // Importante: Render requiere esta configuración SSL para la conexión
    ssl: process.env.NODE_ENV === "production" ? {
        rejectUnauthorized: false
    } : false
});

export default pool;