import { bills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const billId = params.billid;
	const { db } = locals;

	// Fetch the bill with its items
	const bill = await db.query.bills.findFirst({
		where: eq(bills.id, billId),
		with: {
			billItems: {
				with: {
					menuItem: true
				}
			}
		}
	});

	const cafeSettings = await db.query.settings.findFirst();

	return {
		bill,
		settings: cafeSettings
	};
};
