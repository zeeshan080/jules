import { db } from './index'; // Adjust path if your db instance is elsewhere
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Ensure .env from project root is loaded

async function createCakeOrdersTable() {
  console.log('Attempting to create cake_orders table...');
  try {
    // Raw SQL matching the schema defined in src/db/schema.ts
    // Note: For timestamp with timezone, use `timestamptz`. For simple timestamp, `timestamp`.
    // Drizzle's defaultNow() for timestamp often translates to CURRENT_TIMESTAMP.
    // The 'deliveryDate' was a string in schema, which is fine for timestamp if formatted correctly.
    // But for direct SQL, ensure it's a timestamp type.
    // The schema has deliveryDate: timestamp('delivery_date', { mode: 'string' }).notNull(),
    // This is fine for Drizzle, but for raw SQL, it's just a timestamp.
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cake_orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        cake_description TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        delivery_date TIMESTAMP NOT NULL,
        order_status VARCHAR(50) DEFAULT 'pending',
        price REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log('cake_orders table created successfully or already exists.');

    // Optional: Add an index if you anticipate querying by email or order_status frequently
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_cake_orders_email ON cake_orders (email);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_cake_orders_status ON cake_orders (order_status);
    `);
    console.log('Indexes for cake_orders table created successfully or already exist.');

  } catch (error) {
    console.error('Error creating cake_orders table:', error);
    process.exit(1); // Exit with error code
  }
}

createCakeOrdersTable().finally(async () => {
  // If you are using a pooled connection that needs to be explicitly closed:
  // For node-postgres (pg Pool), the pool is generally managed globally by Drizzle/node-postgres
  // and doesn't need explicit closing for a short-lived script like this,
  // especially if the process exits.
  // If your db instance (`db` from './index') creates a pool that needs explicit disposal,
  // you would call something like `pool.end()` here, assuming `pool` is exported from './index'.
  // Since `db` is `drizzle(pool)`, we'd need access to the original `pool` object.
  // For now, we'll let the process exit naturally.
  console.log('Manual migration script finished.');
  // process.exit(0); // Optionally ensure a clean exit if no errors.
});
