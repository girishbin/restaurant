import { bills } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { db } = locals;

	// Fetch the last 12 bills, ordered by creation date.
	// Drizzle's relational query (`with`) will automatically fetch
	// the related billItems for each bill.
	const recentBills = await db.query.bills.findMany({
		orderBy: [desc(bills.createdAt)],
		limit: 12,
		with: {
			billItems: true // Eagerly load the bill items for each bill
		}
	});

	return {
		bills: recentBills
	};
};

export const actions = {
	markAsServed: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const billId = formData.get('billId');

		if (!billId || typeof billId !== 'string') {
			return fail(400, { message: 'Invalid Bill ID' });
		}

		try {
			await db
				.update(bills)
				.set({ orderStatus: 'served' })
				.where(eq(bills.id, billId));

			return { success: true, servedBillId: billId };
		} catch (error) {
			return fail(500, { message: 'Failed to update order status.' });
		}
	}
};