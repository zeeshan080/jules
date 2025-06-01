import { pgTable, serial, text, varchar, timestamp, real } from 'drizzle-orm/pg-core';

export const cakeOrders = pgTable('cake_orders', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  cakeDescription: text('cake_description').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  deliveryDate: timestamp('delivery_date', { mode: 'string' }).notNull(), // Store as string, can be parsed to Date object
  orderStatus: varchar('order_status', { length: 50 }).default('pending'), // e.g., pending, confirmed, baking, ready, delivered
  price: real('price'), // Optional: if you want to set a price later
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
