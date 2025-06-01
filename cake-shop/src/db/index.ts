import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env file in the project root
dotenv.config({ path: '../../.env' }); // Adjust path relative to this file if necessary, or ensure .env is loaded globally once.
                                      // For Next.js, process.env should already be populated if .env is in the root.
                                      // However, for scripts or other contexts, explicit loading might be needed.

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
