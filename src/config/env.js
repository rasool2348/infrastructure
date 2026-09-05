import dotenv from 'dotenv';
import { existsSync } from 'node:fs';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFiles = [`.env.${nodeEnv}`, '.env'];

for (const file of envFiles) {
  if (existsSync(file)) {
    dotenv.config({ path: file, override: false });
  }
}
