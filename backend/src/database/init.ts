import { db } from '../config/database.js';

async function initDatabase(): Promise<void> {
  try {
    // Comprueba que el motor remoto tenga disponible la función SQLite JSONB.
    await db.execute("SELECT jsonb('{}') AS jsonb_probe");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        autor TEXT NOT NULL,
        modulo TEXT NOT NULL,
        content BLOB NOT NULL
      )
    `);

    await db.execute(`CREATE INDEX IF NOT EXISTS idx_records_modulo ON records(modulo)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_records_autor ON records(autor)`);

    console.log('Base de datos CAPA inicializada correctamente.');
    console.log('Tabla: records | Índices: idx_records_modulo, idx_records_autor');
  } catch (error) {
    console.error('No se pudo inicializar la base de datos.');
    console.error('Verifica credenciales y que el motor Turso/libSQL admita jsonb().');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}

await initDatabase();
