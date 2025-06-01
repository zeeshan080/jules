import type { Config } from 'drizzle-kit';

// dotenv.config() is no longer needed here as it's handled by
// `npx -r dotenv/config drizzle-kit...` in package.json scripts

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true, // Added strict mode
} satisfies Config;
