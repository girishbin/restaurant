import { sqliteTable, AnySQLiteColumn, integer, text, real, foreignKey, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const menuItems = sqliteTable("menu_items", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text({ length: 100 }).notNull(),
	description: text(),
	price: real().notNull(),
	category: text({ length: 50 }),
	imageUrl: text("image_url", { length: 255 }),
	isActive: integer("is_active").default(true),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer("updated_at").default(sql`(strftime('%s', 'now'))`),
});

export const billItems = sqliteTable("bill_items", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	billId: text("bill_id").notNull().references(() => bills.id, { onDelete: "cascade" } ),
	menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id),
	itemName: text("item_name", { length: 100 }).notNull(),
	itemPrice: real("item_price").notNull(),
	quantity: integer().default(1).notNull(),
	subtotal: real().notNull(),
	notes: text(),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`),
});

export const bills = sqliteTable("bills", {
	id: text().primaryKey().notNull(),
	billNumber: text("bill_number", { length: 50 }).notNull(),
	customerName: text("customer_name", { length: 100 }),
	customerPhone: text("customer_phone", { length: 20 }),
	totalAmount: real("total_amount").notNull(),
	taxAmount: real("tax_amount"),
	discountAmount: real("discount_amount"),
	finalAmount: real("final_amount").notNull(),
	paymentStatus: text("payment_status", { length: 20 }).default("pending"),
	paymentMethod: text("payment_method", { length: 20 }),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer("updated_at").default(sql`(strftime('%s', 'now'))`),
},
(table) => [
	uniqueIndex("bills_bill_number_unique").on(table.billNumber),
]);

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	username: text({ length: 100 }).notNull(),
	role: text().default("user").notNull(),
	password: text({ length: 100 }).notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer("updated_at").default(sql`(strftime('%s', 'now'))`),
},
(table) => [
	uniqueIndex("users_username_unique").on(table.username),
]);

