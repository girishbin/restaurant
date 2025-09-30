import { bills } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

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