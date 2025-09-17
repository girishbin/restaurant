CREATE TABLE "bill_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_id" integer NOT NULL,
	"menu_item_id" integer NOT NULL,
	"item_name" varchar(100) NOT NULL,
	"item_price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bills" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_number" varchar(50) NOT NULL,
	"customer_name" varchar(100),
	"customer_phone" varchar(20),
	"total_amount" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"final_amount" numeric(10, 2) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'pending',
	"payment_method" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "bills_bill_number_unique" UNIQUE("bill_number")
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"category" varchar(50),
	"is_active" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;