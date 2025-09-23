import { fail, redirect } from '@sveltejs/kit';
import { bills, billItems } from '$lib/server/db/schema';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

// This schema validates the incoming form data.
// It expects a JSON string for the cart items.
const checkoutSchema = zfd.formData({
	customerName: zfd.text(z.string().optional()),
	customerPhone: zfd.text(z.string().optional()),
	paymentMethod: zfd.text(z.enum(['cash', 'card', 'upi'])),
	items: zfd.json(
		z.array(
			z.object({
				id: z.number(),
				name: z.string(),
				price: z.number(),
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

		const { customerName, customerPhone, paymentMethod, items } = result.data;

		// 3. Perform calculations and database operations in a transaction
		try {
			const newBill = await db.transaction(async (tx) => {
				const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
				// For now, final amount is the same as total. You can add tax/discounts here.
				const finalAmount = totalAmount;

				// Insert the main bill record
				const [bill] = await tx
					.insert(bills)
					.values({
						billNumber: `BILL-${Date.now()}`, // A simple unique bill number
						customerName,
						customerPhone,
						paymentMethod,
						totalAmount,
						finalAmount,
						paymentStatus: 'paid' // Assume payment is successful on checkout
					})
					.returning({ id: bills.id });

				if (!bill) {
					tx.rollback();
					return;
				}

				// Prepare all the individual bill items
				const billItemsToInsert = items.map((item) => ({
					billId: bill.id,
					menuItemId: item.id,
					itemName: item.name,
					itemPrice: item.price,
					quantity: item.quantity,
					subtotal: item.price * item.quantity
				}));

				// Insert all bill items
				await tx.insert(billItems).values(billItemsToInsert);

				return bill;
			});

			if (!newBill) {
				return fail(500, { message: 'Could not create the bill.' });
			}

			// 4. Redirect on success
			throw redirect(303, `/bill/receipt/${newBill.id}`); // Redirect to a receipt page

		} catch (error) {
			console.error('Checkout Error:', error);
			return fail(500, { message: 'An unexpected error occurred during checkout.' });
		}
	}
};
