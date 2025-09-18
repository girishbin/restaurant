import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { bills, billItems } from '$lib/server/db/schema';
import { z } from 'zod';

const cartItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	price: z.string(),
	quantity: z.number().min(1),
	total: z.number()
});

const cartItemsSchema = z.array(cartItemSchema);

/**
 * Parses and validates cart items from a request.
 * @param {Request} request The incoming request object.
 * @returns {Promise<{data?: z.infer<typeof cartItemsSchema>, error?: import('@sveltejs/kit').ActionFailure}>}
 */
async function parseAndValidateCart(request) {
	const formData = await request.formData();
	const cartData = formData.get('items');

	if (typeof cartData !== 'string') {
		return { error: fail(400, { message: 'Invalid cart data submitted.' }) };
	}

	const parseResult = cartItemsSchema.safeParse(JSON.parse(cartData));

	if (!parseResult.success) {
		return { error: fail(400, { message: 'Cart data is corrupt or invalid.' }) };
	}
	const parsedCartItems = parseResult.data;

	if (parsedCartItems.length === 0) {
		return { error: fail(400, { message: 'Cart is empty.' }) };
	}

	return { data: parsedCartItems };
}

export const actions = {
	// This action prepares the data for the confirmation screen.
	prepare: async ({ request }) => {
		const { data: parsedCartItems, error } = await parseAndValidateCart(request);
		if (error) return error;

		const total = parsedCartItems.reduce((sum, item) => sum + item.total, 0);

		// Return the items to be displayed on the confirmation page.
		return {
			items: parsedCartItems,
			rawItems: JSON.stringify(parsedCartItems), // Re-serialize validated data
			total: total.toFixed(2)
		};
	},

	// This new action will handle the final confirmation and database insertion.
	confirm: async ({ request }) => {
		const { data: parsedCartItems, error } = await parseAndValidateCart(request);
		if (error) return error;

		try {
			await db.transaction(async (tx) => {
				const total = parsedCartItems.reduce((sum, item) => sum + item.total, 0);
				const billNumber = `BILL-${Date.now()}`;

				const [newBill] = await tx
					.insert(bills)
					.values({
						billNumber: billNumber,
						totalAmount: String(total.toFixed(2)),
						finalAmount: String(total.toFixed(2)) // Assuming no tax/discount for now
					})
					.returning({ id: bills.id });

				if (!newBill) {
					throw new Error('Failed to create bill.');
				}

				const itemsToInsert = parsedCartItems.map((item) => ({
					billId: newBill.id,
					menuItemId: item.id,
					itemName: item.name,
					itemPrice: item.price,
					quantity: item.quantity,
					subtotal: String(item.total.toFixed(2))
				}));

				if (itemsToInsert.length > 0) {
					await tx.insert(billItems).values(itemsToInsert);
				}
			});
		} catch (error) {
			console.error('Checkout error:', error);
			return fail(500, { message: 'Could not process checkout.' });
		}

		// On success, return a success message to be displayed on the page.
		return { success: true, message: 'Your order has been placed successfully!' };
	}
};