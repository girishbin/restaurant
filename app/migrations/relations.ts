import { relations } from "drizzle-orm/relations";
import { menuItems, billItems, bills } from "./schema";

export const billItemsRelations = relations(billItems, ({one}) => ({
	menuItem: one(menuItems, {
		fields: [billItems.menuItemId],
		references: [menuItems.id]
	}),
	bill: one(bills, {
		fields: [billItems.billId],
		references: [bills.id]
	}),
}));

export const menuItemsRelations = relations(menuItems, ({many}) => ({
	billItems: many(billItems),
}));

export const billsRelations = relations(bills, ({many}) => ({
	billItems: many(billItems),
}));