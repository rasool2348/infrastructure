import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// if (process.env.NODE_ENV === 'development') {
//   neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
//   neonConfig.useSecureWebSocket = false;
//   neonConfig.poolQueryViaFetch = true;
// }

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
