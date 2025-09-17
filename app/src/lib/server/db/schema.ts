import { pgTable, serial, varchar, decimal, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Menu Items table - stores all available menu items
export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 50 }), // e.g., 'food', 'beverage', 'dessert'
  isActive: integer('is_active').default(1), // 1 for active, 0 for inactive
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Bills/Invoices table - stores bill information
export const bills = pgTable('bills', {
  id: serial('id').primaryKey(),
  billNumber: varchar('bill_number', { length: 50 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 100 }),
  customerPhone: varchar('customer_phone', { length: 20 }),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  finalAmount: decimal('final_amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending'), // pending, paid, cancelled
  paymentMethod: varchar('payment_method', { length: 20 }), // cash, card, upi, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Bill Items table - stores individual items in each bill
export const billItems = pgTable('bill_items', {
  id: serial('id').primaryKey(),
  billId: integer('bill_id').notNull().references(() => bills.id, { onDelete: 'cascade' }),
  menuItemId: integer('menu_item_id').notNull().references(() => menuItems.id),
  itemName: varchar('item_name', { length: 100 }).notNull(), // Store name at time of order
  itemPrice: decimal('item_price', { precision: 10, scale: 2 }).notNull(), // Store price at time of order
  quantity: integer('quantity').notNull().default(1),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'), // Special instructions or notes
  createdAt: timestamp('created_at').defaultNow()
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

// Export types for TypeScript
export type MenuItemInsert = typeof menuItems.$inferInsert;
export type MenuItemSelect = typeof menuItems.$inferSelect;

export type BillInsert = typeof bills.$inferInsert;
export type BillSelect = typeof bills.$inferSelect;

export type BillItemInsert = typeof billItems.$inferInsert;
export type BillItemSelect = typeof billItems.$inferSelect;