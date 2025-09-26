import { bills } from '$lib/server/db/schema';
import { and, desc, gte, lte } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	const { db } = locals;

	const from = url.searchParams.get('from');
	const to = url.searchParams.get('to');

	const conditions = [];

	if (from) {
		// The user selects a date like '2024-05-10'. We interpret this as the start of that day in IST.
		// By appending the IST offset (+05:30), we create a timezone-aware date object.
		// new Date('2024-05-10T00:00:00.000+05:30') correctly represents the start of the day in India.
		const fromDate = new Date(`${from}T00:00:00.000+05:30`);
		conditions.push(gte(bills.createdAt, fromDate));
	}
	if (to) {
		// Similarly, we interpret the 'to' date as the end of that day in IST.
		// new Date('2024-05-10T23:59:59.999+05:30') represents the end of the day in India.
		// The Date object will automatically handle the conversion to its internal UTC representation for the query.
		const toDate = new Date(`${to}T23:59:59.999+05:30`);
		conditions.push(lte(bills.createdAt, toDate));
	}

	// Fetch bills from the database, applying date filters if they exist.
	const allBills = await db
		.select({
			billId: bills.id,
			billNumber: bills.billNumber,
			finalAmount: bills.finalAmount,
			paymentStatus: bills.paymentStatus,
			paymentMethod: bills.paymentMethod,
			createdAt: bills.createdAt
		})
		.from(bills)
		.where(and(...conditions))
		.orderBy(desc(bills.createdAt));

	const totalSales = allBills.reduce((sum, bill) => sum + Number(bill.finalAmount), 0);

	return {
		bills: allBills,
		totalSales: totalSales
	};
}
