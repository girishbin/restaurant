import { expenses } from '$lib/server/db/schema';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const editExpenseSchema = zfd.formData({
	id: zfd.numeric(z.number().int().positive()),
	name: zfd.text(z.string().min(1, 'Name is required')),
	amount: zfd.numeric(z.number().positive('Amount must be positive')),
	category: zfd.text(z.string().optional()),
	expenseDate: zfd.text(z.string().min(1, 'Date is required')),
	description: zfd.text(z.string().optional())
});

const deleteExpenseSchema = zfd.formData({
	id: zfd.numeric(z.number().int().positive())
});

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
		conditions.push(gte(expenses.expenseDate, fromDate));
	}
	if (to) {
		// Similarly, we interpret the 'to' date as the end of that day in IST.
		// new Date('2024-05-10T23:59:59.999+05:30') represents the end of the day in India.
		// The Date object will automatically handle the conversion to its internal UTC representation for the query.
		const toDate = new Date(`${to}T23:59:59.999+05:30`);
		conditions.push(lte(expenses.expenseDate, toDate));
	}

	// Fetch expenses from the database, applying date filters if they exist.
	const allExpenses = await db
		.select()
		.from(expenses)
		.where(and(...conditions))
		.orderBy(desc(expenses.expenseDate));

	const totalAmount = allExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

	const totalExpenses = allExpenses.length;

	return {
		expenses: allExpenses,
		totalAmount: totalAmount,
		totalExpenses: totalExpenses
	};
}

export const actions = {
	editExpense: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const validation = editExpenseSchema.safeParse(formData);

		if (!validation.success) {
			const errors = validation.error.flatten().fieldErrors;
			return fail(400, {
				data,
				errors,
				message: 'Please check the form for errors.'
			});
		}

		try {
			const { id, name, amount, category, expenseDate, description } = validation.data;
			await db
				.update(expenses)
				.set({
					name,
					amount,
					category: category || null,
					expenseDate: new Date(expenseDate),
					description: description || null
				})
				.where(eq(expenses.id, id));
			return { success: true, message: 'Expense updated successfully!' };
		} catch (error) {
			console.error('Failed to update expense:', error);
			return fail(500, { data, message: 'Could not update the expense.' });
		}
	},

	deleteExpense: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();

		const validation = deleteExpenseSchema.safeParse(formData);

		if (!validation.success) {
			return fail(400, { message: 'Invalid expense ID.' });
		}

		try {
			const { id } = validation.data;
			await db.delete(expenses).where(eq(expenses.id, id));
			return { success: true, message: 'Expense deleted successfully.' };
		} catch (error) {
			console.error('Failed to delete expense:', error);
			return fail(500, { message: 'Could not delete the expense.' });
		}
	}
};
