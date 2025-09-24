import { fail, redirect } from '@sveltejs/kit';
import { bills, billItems } from '$lib/server/db/schema';
import { randomUUID } from 'node:crypto';
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

		// 3. Generate a UUID for the new bill on the server
		const billId = randomUUID();

		try {
			// 4. Prepare batch statements for an atomic D1 transaction
			const finalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
			
			// Calculate subtotal (pre-tax) and tax amount from the final, tax-inclusive price.
			const subtotal = finalAmount * 0.95;
			const taxAmount = finalAmount * 0.05;

			const billStatement = db.insert(bills).values({
				id: billId, // Use the generated UUID
				billNumber: `BILL-${Date.now()}`,
				customerName,
				customerPhone,
				paymentMethod,
				totalAmount: subtotal, // Store the pre-tax amount as totalAmount
				taxAmount: taxAmount, // Store the calculated tax
				finalAmount: finalAmount, // Store the final, inclusive amount
				paymentStatus: 'paid' // Assume payment is successful on checkout
			});

			const billItemsToInsert = items.map((item) => ({
				billId: billId, // Use the same generated UUID
				menuItemId: item.id,
				itemName: item.name,
				itemPrice: item.price * 0.95, // Store the pre-tax item price
				quantity: item.quantity,
				subtotal: (item.price * item.quantity) * 0.95 // Store the pre-tax line total
			}));

			const billItemsStatement = db.insert(billItems).values(billItemsToInsert);

			// 5. Execute both statements in a single, atomic batch
			await db.batch([billStatement, billItemsStatement]);

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

		// 6. Redirect on success, after the try...catch block has completed.
		throw redirect(303, `/bill/receipt/${billId}`);
	}
};
