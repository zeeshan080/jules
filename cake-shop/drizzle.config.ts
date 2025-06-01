import type { Config } from 'drizzle-kit';

// dotenv.config() is no longer needed here as it's handled by
// `npx -r dotenv/config drizzle-kit...` in package.json scripts

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    // ssl: true, // Uncomment if SSL is required
  },
  verbose: true,
  strict: true, // Added strict mode
} satisfies Config;
