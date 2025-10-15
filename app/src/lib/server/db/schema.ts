import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { Name, relations, sql } from 'drizzle-orm';

// Simple auth user table
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username', { length: 100 }).notNull().unique(),
	role: text('role', { enum: ['admin', 'user'] }).default('user').notNull(),
	password: text('password', { length: 100 }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

// Menu Items table - stores all available menu items
export const menuItems = sqliteTable('menu_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name', { length: 100 }).notNull(),
    description: text('description'),
	price: real('price').notNull(),
	category: text('category', { length: 50 }), // e.g., 'food', 'beverage', 'dessert'
	imageUrl: text('image_url', { length: 255 }),
	isActive: integer('is_active', { mode: 'boolean' }).default(true), // 1 for active, 0 for inactive
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

// Bills/Invoices table - stores bill information
export const bills = sqliteTable('bills', {
	id: text('id').primaryKey(),
	billNumber: text('bill_number', { length: 50 }).notNull().unique(),
	customerName: text('customer_name', { length: 100 }),
	customerPhone: text('customer_phone', { length: 20 }),
	totalAmount: real('total_amount').notNull(),
	taxAmount: real('tax_amount').default(0),
	discountAmount: real('discount_amount').default(0),
	finalAmount: real('final_amount').notNull(),
	tableNumber: integer('table_number').notNull(),
	orderStatus: text('order_status', { enum: ['new', 'served'] }).default('new').notNull(),
	paymentStatus: text('payment_status', { length: 20 }).default('pending'), // pending, paid, cancelled
	paymentMethod: text('payment_method', { length: 20 }), // cash, card, upi, etc.
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

// Bill Items table - stores individual items in each bill
export const billItems = sqliteTable('bill_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
  billId: text('bill_id').notNull().references(() => bills.id, { onDelete: 'cascade' }),
  menuItemId: integer('menu_item_id').notNull().references(() => menuItems.id),
	itemName: text('item_name', { length: 100 }).notNull(), // Store name at time of order
	itemPrice: real('item_price').notNull(), // Store price at time of order
  quantity: integer('quantity').notNull().default(1),
	subtotal: real('subtotal').notNull(),
  notes: text('notes'), // Special instructions or notes
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

// Define relations
export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  billItems: many(billItems)
}));

export const billsRelations = relations(bills, ({ many }) => ({
  billItems: many(billItems)
}));

export const billItemsRelations = relations(billItems, ({ one }) => ({
  bill: one(bills, {
    fields: [billItems.billId],
    references: [bills.id]
  }),
  menuItem: one(menuItems, {
    fields: [billItems.menuItemId],
    references: [menuItems.id]
  })
}));

export const expenses = sqliteTable("expenses", {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name', { length: 100 }).notNull(),
	amount: real('amount').notNull(),
	category: text('category', { length: 50 }),
	expenseDate: integer('expense_date', { mode: 'timestamp' }).notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const settings = sqliteTable("settings", {
	id: integer('id').primaryKey({ autoIncrement: true }),
	cafeName: text('cafe_name', { length: 100 }).notNull(),
	cafeAddress: text('cafe_address'),
	cafePhone: text('cafe_phone', { length: 20 }),
	cafeLicense: text('cafe_license'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Export types for TypeScript

export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export type MenuItemInsert = typeof menuItems.$inferInsert;
export type MenuItemSelect = typeof menuItems.$inferSelect;

export type BillInsert = typeof bills.$inferInsert;
export type BillSelect = typeof bills.$inferSelect;

export type BillItemInsert = typeof billItems.$inferInsert;
export type BillItemSelect = typeof billItems.$inferSelect;

export type ExpenseInsert = typeof expenses.$inferInsert;
export type ExpenseSelect = typeof expenses.$inferSelect;

export type SettingInsert = typeof settings.$inferInsert;
export type SettingSelect = typeof settings.$inferSelect;