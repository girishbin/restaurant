import { fail, redirect } from '@sveltejs/kit';
import { bills, billItems, menuItems} from '$lib/server/db/schema';
import { randomUUID } from 'node:crypto';
import { inArray } from 'drizzle-orm';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

// This schema validates the incoming form data.
// It expects a JSON string for the cart items.
const checkoutSchema = zfd.formData({
	customerName: zfd.text(z.string().optional()),
	customerPhone: zfd.text(z.string().optional()),
	paymentMethod: zfd.text(z.enum(['cash', 'card', 'upi'])),
	tableNumber: zfd.numeric(z.number()),
	items: zfd.json(
		z.array(
			z.object({
				id: z.number(),
				quantity: z.number()
			})
		).min(1, "Cannot checkout with an empty cart.")
	)
});

export const actions = {
	confirm: async ({ request, locals }) => {
		// 1. Get the database connection from locals
		const { db } = locals;

		const formData = await request.formData();
		const result = checkoutSchema.safeParse(formData);

		// 2. Validate the form data
		if (!result.success) {
			const errors = result.error.flatten();
			return fail(400, { issues: errors.fieldErrors });
		}

		const { customerName, customerPhone, paymentMethod, tableNumber, items } = result.data;

		// --- Server-Side Price & Name Lookup (Security Enhancement) ---
		// Get all unique item IDs from the cart.
		const itemIds = items.map((item) => item.id);

		// Fetch the authoritative details for these items from the database.
		const menuItemsFromDB = await db.select().from(menuItems).where(inArray(menuItems.id, itemIds));

		// Create a map for quick lookups.
		const menuItemMap = new Map(menuItemsFromDB.map((dbItem) => [dbItem.id, dbItem]));

		// Reconstruct the cart on the server with authoritative data.
		// This prevents price tampering from the client.
		const secureCartItems = items.map(item => {
			const dbItem = menuItemMap.get(item.id);
			if (!dbItem) {
				// This case should be rare, but handles if an item was deleted after being added to cart.
				throw new Error(`Item with ID ${item.id} not found in database.`);
			}
			return { ...dbItem, quantity: item.quantity };
		});

		// 3. Generate a UUID for the new bill on the server
		const billId = randomUUID();

		try {
			// 4. Calculate bill totals using the secure, server-side cart data.
			const finalAmount = secureCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
			const subtotal = finalAmount * 0.95;
			const taxAmount = finalAmount * 0.05;

			// 5. Prepare all statements for D1's atomic batch operation.
			const statements = [];

			// Statement 1: Insert the main bill record.
			statements.push(db.insert(bills).values({
				id: billId,
				billNumber: `BILL-${Date.now()}`,
				customerName,
				customerPhone,
				paymentMethod,
				totalAmount: subtotal,
				taxAmount: taxAmount,
				finalAmount: finalAmount,
				paymentStatus: 'paid',
				tableNumber: tableNumber
			}));

			// Statements 2...N: Add a separate INSERT statement for EACH item.
			// This is the most robust way to avoid the "too many SQL variables" error with D1's batch API,
			// as it guarantees each statement is very small.
			for (const item of secureCartItems) {
				statements.push(db.insert(billItems).values({
					billId: billId,
					menuItemId: item.id,
					itemName: item.name,
					itemPrice: item.price * 0.95,
					quantity: item.quantity,
					subtotal: item.price * item.quantity * 0.95
				}));
			}

			// 6. Execute the entire batch. D1 guarantees this is atomic.
			await db.batch(statements);
		} catch (error) {
			// Drizzle will throw an error if the transaction fails.
			// This could be due to a foreign key constraint (e.g., a menuItemId doesn't exist).
			if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
				console.error('Checkout Error - Foreign Key Constraint:', error);
				return fail(400, { message: 'One or more items in the cart are invalid or no longer available. Please refresh and try again.' });
			}

			console.error('Checkout Error:', error);
			return fail(500, { message: 'An unexpected error occurred during checkout.' });
		}

		// 7. Redirect on success
		throw redirect(303, `/bill/receipt/${billId}`);
	}
};
