import '#config/env.js';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Neon Local only supports HTTP for the serverless driver (not websockets).
// See: https://neon.com/docs/local/neon-local
if (process.env.NEON_LOCAL === 'true') {
  const host = process.env.NEON_LOCAL_HOST || 'localhost';
  neonConfig.fetchEndpoint = `http://${host}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export default db;
