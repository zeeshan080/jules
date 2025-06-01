CREATE TABLE "cake_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"cake_description" text NOT NULL,
	"delivery_address" text NOT NULL,
	"delivery_date" timestamp NOT NULL,
	"order_status" varchar(50) DEFAULT 'pending',
	"price" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
