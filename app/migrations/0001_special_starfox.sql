PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bill_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bill_id` text NOT NULL,
	`menu_item_id` integer NOT NULL,
	`item_name` text(100) NOT NULL,
	`item_price` real NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`subtotal` real NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_bill_items`("id", "bill_id", "menu_item_id", "item_name", "item_price", "quantity", "subtotal", "notes", "created_at") SELECT "id", "bill_id", "menu_item_id", "item_name", "item_price", "quantity", "subtotal", "notes", "created_at" FROM `bill_items`;--> statement-breakpoint
DROP TABLE `bill_items`;--> statement-breakpoint
ALTER TABLE `__new_bill_items` RENAME TO `bill_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_bills` (
	`id` text PRIMARY KEY NOT NULL,
	`bill_number` text(50) NOT NULL,
	`customer_name` text(100),
	`customer_phone` text(20),
	`total_amount` real NOT NULL,
	`tax_amount` real DEFAULT 0,
	`discount_amount` real DEFAULT 0,
	`final_amount` real NOT NULL,
	`payment_status` text(20) DEFAULT 'pending',
	`payment_method` text(20),
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_bills`("id", "bill_number", "customer_name", "customer_phone", "total_amount", "tax_amount", "discount_amount", "final_amount", "payment_status", "payment_method", "created_at", "updated_at") SELECT "id", "bill_number", "customer_name", "customer_phone", "total_amount", "tax_amount", "discount_amount", "final_amount", "payment_status", "payment_method", "created_at", "updated_at" FROM `bills`;--> statement-breakpoint
DROP TABLE `bills`;--> statement-breakpoint
ALTER TABLE `__new_bills` RENAME TO `bills`;--> statement-breakpoint
CREATE UNIQUE INDEX `bills_bill_number_unique` ON `bills` (`bill_number`);