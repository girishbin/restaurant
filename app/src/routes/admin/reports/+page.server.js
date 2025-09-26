import { bills } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { db } = locals;

	// Fetch all bills from the database, ordering by the most recent first.
	const allBills = await db
		.select({
			billNumber: bills.billNumber,
			finalAmount: bills.finalAmount,
			paymentStatus: bills.paymentStatus,
			paymentMethod: bills.paymentMethod,
			createdAt: bills.createdAt
		})
		.from(bills)
		.orderBy(desc(bills.createdAt));

	return { bills: allBills };
}
