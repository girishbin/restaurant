CREATE TABLE `bill_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bill_id` integer NOT NULL,
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
CREATE TABLE `bills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
CREATE UNIQUE INDEX `bills_bill_number_unique` ON `bills` (`bill_number`);--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`category` text(50),
	`image_url` text(255),
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
