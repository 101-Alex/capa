import 'dotenv/config';
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error(
    'Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN. Configura el archivo .env antes de ejecutar el proyecto.'
  );
}

/** Cliente compartido de Turso para toda la aplicación. */
export const db = createClient({ url, authToken });
