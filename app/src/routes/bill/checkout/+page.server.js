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
 * @param {FormData} formData The form data from the request.
 * @returns {Promise<{data?: z.infer<typeof cartItemsSchema>, error?: import('@sveltejs/kit').ActionFailure}>}
 */
function parseAndValidateCartItems(formData) {
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
	// This new action will handle the final confirmation and database insertion.
	confirm: async ({ request }) => {
		const formData = await request.formData();
		const { data: parsedCartItems, error } = parseAndValidateCartItems(formData);
		if (error) return error;

		const customerName = formData.get('customerName');
		const customerPhone = formData.get('customerPhone');
		const paymentMethod = formData.get('paymentMethod');

		try {
			const billDetails = await db.transaction(async (tx) => {
				const finalAmount = parsedCartItems.reduce((sum, item) => sum + item.total, 0);
				const totalAmount = finalAmount / 1.05; // Pre-tax amount
				const taxAmount = finalAmount - totalAmount;
				const billNumber = `BILL-${Date.now()}`;

				const [newBill] = await tx
					.insert(bills)
					.values({
						billNumber: billNumber,
						customerName: typeof customerName === 'string' && customerName ? customerName.trim() : null,
						customerPhone: typeof customerPhone === 'string' && customerPhone ? customerPhone.trim() : null,
						paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : 'cash',
						totalAmount: String(totalAmount.toFixed(2)),
						taxAmount: String(taxAmount.toFixed(2)),
						finalAmount: String(finalAmount.toFixed(2))
					})
					.returning({ id: bills.id, billNumber: bills.billNumber, createdAt: bills.createdAt });

				if (!newBill) {
					throw new Error('Failed to create bill.');
				}

				if (parsedCartItems.length > 0) {
					const itemsToInsert = parsedCartItems.map((item) => ({
						billId: newBill.id,
						menuItemId: item.id,
						itemName: item.name,
						itemPrice: item.price,
						quantity: item.quantity,
						subtotal: String(item.total.toFixed(2))
					}));
					await tx.insert(billItems).values(itemsToInsert);
				}

				return {
					billNumber: newBill.billNumber,
					customerName: typeof customerName === 'string' && customerName ? customerName.trim() : null,
					customerPhone:
						typeof customerPhone === 'string' && customerPhone ? customerPhone.trim() : null,
					paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : 'cash',
					items: parsedCartItems,
					totalAmount: totalAmount.toFixed(2),
					taxAmount: taxAmount.toFixed(2),
					finalAmount: finalAmount.toFixed(2),
					createdAt: newBill.createdAt.toISOString()
				};
			});

			if (!billDetails) {
				throw new Error('Transaction failed, could not retrieve bill details.');
			}

			return { success: true, bill: billDetails };
		} catch (error) {
			console.error('Checkout error:', error);
			return fail(500, { message: 'Could not process checkout.' });
		}
	}
};