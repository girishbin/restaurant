PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
INSERT INTO __drizzle_migrations VALUES(NULL,'8d5422886ff0ac034f754a221bedc512d2b99391d4161887760a0efbfe29abbc',1758616289535);
INSERT INTO __drizzle_migrations VALUES(NULL,'9bf7da9f6782e70067be3ae36c32af0af7b74674251fe45a6a7c9b95d2f6159f',1758651794243);
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
INSERT INTO menu_items VALUES(1,'Masala gobi paratha',NULL,100,'Paranthas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:42:35.272Z,2025-09-17T05:42:35.272Z);
INSERT INTO menu_items VALUES(2,'Aloo pyaaz paratha',NULL,100,'Paranthas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:44:10.715Z,2025-09-17T05:44:10.715Z);
INSERT INTO menu_items VALUES(3,'Masala aloo paratha',NULL,100,'Paranthas','https://images.unsplash.com/photo-1580064003296-29deb3521370?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:46:33.900Z,2025-09-17T05:46:33.900Z);
INSERT INTO menu_items VALUES(4,'Methi Paratha',NULL,100,'Paranthas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:47:08.642Z,2025-09-17T05:47:08.642Z);
INSERT INTO menu_items VALUES(9,'Parazza Margaretta',NULL,120,'Parazzas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:49:12.675Z,2025-09-17T05:49:12.675Z);
INSERT INTO menu_items VALUES(10,'Parazza Mexicano',NULL,120,'Parazzas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:49:12.680Z,2025-09-17T05:49:12.680Z);
INSERT INTO menu_items VALUES(11,'Parazza Paprika',NULL,120,'Parazzas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:49:12.680Z,2025-09-17T05:49:12.680Z);
INSERT INTO menu_items VALUES(12,'Parazza Exotica',NULL,120,'Parazzas','https://images.unsplash.com/photo-1668357530437-72a12c660f94?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:49:12.681Z,2025-09-17T05:49:12.681Z);
INSERT INTO menu_items VALUES(13,'Boondi Raita',NULL,130,'Raita','https://images.unsplash.com/photo-1728910107657-a1806c4e22bf?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:51:16.318Z,2025-09-17T05:51:16.318Z);
INSERT INTO menu_items VALUES(14,'Pyaaz Tamatar Raita',NULL,130,'Raita','https://images.unsplash.com/photo-1728910107657-a1806c4e22bf?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:51:16.323Z,2025-09-17T05:51:16.323Z);
INSERT INTO menu_items VALUES(15,'Spiced Yogurt',NULL,130,'Raita','https://images.unsplash.com/photo-1728910107657-a1806c4e22bf?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:51:16.324Z,2025-09-17T05:51:16.324Z);
INSERT INTO menu_items VALUES(16,'Spiced Butter',NULL,130,'Raita','https://images.unsplash.com/photo-1728910107657-a1806c4e22bf?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:51:16.325Z,2025-09-17T05:51:16.325Z);
INSERT INTO menu_items VALUES(17,'Rajma rice bowl',NULL,130,'Rice-bowls','https://images.unsplash.com/photo-1602881916963-5daf2d97c06e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:53:19.530Z,2025-09-17T05:53:19.530Z);
INSERT INTO menu_items VALUES(18,'Jeera rice with Dal bowl',NULL,130,'Rice-bowls','https://images.unsplash.com/photo-1602881916963-5daf2d97c06e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:53:19.543Z,2025-09-17T05:53:19.543Z);
INSERT INTO menu_items VALUES(19,'Turkish Pilaf',NULL,130,'Rice-bowls','https://images.unsplash.com/photo-1602881916963-5daf2d97c06e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:53:19.544Z,2025-09-17T05:53:19.544Z);
INSERT INTO menu_items VALUES(20,'Plain Chutney Toast',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.593Z,2025-09-17T05:55:30.593Z);
INSERT INTO menu_items VALUES(21,'Smoked Paneer Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.599Z,2025-09-17T05:55:30.599Z);
INSERT INTO menu_items VALUES(22,'Jumbo Cheese Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.600Z,2025-09-17T05:55:30.600Z);
INSERT INTO menu_items VALUES(23,'Chilli Panner Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.600Z,2025-09-17T05:55:30.600Z);
INSERT INTO menu_items VALUES(24,'Corn Cheese Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.601Z,2025-09-17T05:55:30.601Z);
INSERT INTO menu_items VALUES(25,'Masala Paneer Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.601Z,2025-09-17T05:55:30.601Z);
INSERT INTO menu_items VALUES(26,'Avacado Toast/Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.605Z,2025-09-17T05:55:30.605Z);
INSERT INTO menu_items VALUES(27,'Aloo Capsicum Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.607Z,2025-09-17T05:55:30.607Z);
INSERT INTO menu_items VALUES(28,'Chilli Cheese Sandwich',NULL,140,'Sandwiches','https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=4854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:55:30.607Z,2025-09-17T05:55:30.607Z);
INSERT INTO menu_items VALUES(33,'Grilled Vegetable Roll',NULL,150,'Rolls','https://images.unsplash.com/photo-1648146299257-080ffe5968f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:57:24.503Z,2025-09-17T05:57:24.503Z);
INSERT INTO menu_items VALUES(34,'Smoked Paneer Roll',NULL,150,'Rolls','https://images.unsplash.com/photo-1648146299257-080ffe5968f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:57:24.507Z,2025-09-17T05:57:24.507Z);
INSERT INTO menu_items VALUES(35,'Aloo Onion Roll',NULL,150,'Rolls','https://images.unsplash.com/photo-1648146299257-080ffe5968f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:57:24.507Z,2025-09-17T05:57:24.507Z);
INSERT INTO menu_items VALUES(36,'Chilli Cheese Roll',NULL,150,'Rolls','https://images.unsplash.com/photo-1648146299257-080ffe5968f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',1,2025-09-17T05:57:24.508Z,2025-09-17T05:57:24.508Z);
CREATE TABLE IF NOT EXISTS "bill_items" (
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
INSERT INTO bill_items VALUES(1,'c1bd4122-9495-45b0-8a14-d4fa67c0c264',3,'Masala aloo paratha',100,2,200,NULL,1758652390);
INSERT INTO bill_items VALUES(2,'c1bd4122-9495-45b0-8a14-d4fa67c0c264',2,'Aloo pyaaz paratha',100,2,200,NULL,1758652390);
INSERT INTO bill_items VALUES(3,'c1bd4122-9495-45b0-8a14-d4fa67c0c264',12,'Parazza Exotica',120,1,120,NULL,1758652390);
INSERT INTO bill_items VALUES(4,'ddd4932b-6b53-41fb-b68b-c418609e82ab',3,'Masala aloo paratha',100,2,200,NULL,1758652424);
INSERT INTO bill_items VALUES(5,'ddd4932b-6b53-41fb-b68b-c418609e82ab',2,'Aloo pyaaz paratha',100,2,200,NULL,1758652424);
INSERT INTO bill_items VALUES(6,'ddd4932b-6b53-41fb-b68b-c418609e82ab',12,'Parazza Exotica',120,1,120,NULL,1758652424);
INSERT INTO bill_items VALUES(7,'c469dd6a-6c11-4f10-a954-d670ff655576',3,'Masala aloo paratha',100,2,200,NULL,1758652438);
INSERT INTO bill_items VALUES(8,'c469dd6a-6c11-4f10-a954-d670ff655576',2,'Aloo pyaaz paratha',100,2,200,NULL,1758652438);
INSERT INTO bill_items VALUES(9,'c469dd6a-6c11-4f10-a954-d670ff655576',12,'Parazza Exotica',120,1,120,NULL,1758652438);
INSERT INTO bill_items VALUES(10,'a50aa8a3-be18-4615-b1ee-19c5488dcb81',3,'Masala aloo paratha',100,2,200,NULL,1758652506);
INSERT INTO bill_items VALUES(11,'a50aa8a3-be18-4615-b1ee-19c5488dcb81',2,'Aloo pyaaz paratha',100,2,200,NULL,1758652506);
INSERT INTO bill_items VALUES(12,'a50aa8a3-be18-4615-b1ee-19c5488dcb81',12,'Parazza Exotica',120,1,120,NULL,1758652506);
CREATE TABLE IF NOT EXISTS "bills" (
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
INSERT INTO bills VALUES('c1bd4122-9495-45b0-8a14-d4fa67c0c264','BILL-1758652390209',NULL,NULL,520,0,0,520,'paid','cash',1758652390,1758652390);
INSERT INTO bills VALUES('ddd4932b-6b53-41fb-b68b-c418609e82ab','BILL-1758652424665',NULL,NULL,520,0,0,520,'paid','cash',1758652424,1758652424);
INSERT INTO bills VALUES('c469dd6a-6c11-4f10-a954-d670ff655576','BILL-1758652438486','girish','8282822',520,0,0,520,'paid','cash',1758652438,1758652438);
INSERT INTO bills VALUES('a50aa8a3-be18-4615-b1ee-19c5488dcb81','BILL-1758652506299','girish','8282822',520,0,0,520,'paid','cash',1758652506,1758652506);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('menu_items',36);
INSERT INTO sqlite_sequence VALUES('bill_items',12);
CREATE UNIQUE INDEX `bills_bill_number_unique` ON `bills` (`bill_number`);
