import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { bills } from '$lib/server/db/schema';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	const { db } = locals;
	// Correctly extract the 'billid' parameter and assign it to the 'billId' variable.
	const { billid: billId } = params;

	// Fetch the bill and its associated items using a relational query
	const bill = await db.query.bills.findFirst({
		where: eq(bills.id, billId),
		with: {
			billItems: true // This uses the relation defined in your schema.ts
		}
	});

	if (!bill) {
		throw error(404, 'Bill not found');
	}

	return { bill };
}
