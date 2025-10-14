CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL,
	`amount` real NOT NULL,
	`category` text(50),
	`expense_date` integer NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
