import { expenses } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { zfd } from 'zod-form-data';

const expenseSchema = zfd.formData({
	name: zfd.text(z.string().min(1, 'Name is required')),
	amount: zfd.numeric(z.number().positive('Amount must be positive')),
	category: zfd.text(z.string().optional()),
	expenseDate: zfd.text(z.string().min(1, 'Date is required')),
	description: zfd.text(z.string().optional())
});

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

export const load = async ({ locals }) => {
	const { db } = locals;
	const allExpenses = await db.select().from(expenses).orderBy(expenses.expenseDate);
	return {
		expenses: allExpenses
	};
};

export const actions = {
	addExpense: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const validation = expenseSchema.safeParse(formData);

		if (!validation.success) {
			const errors = validation.error.flatten().fieldErrors;
			return fail(400, {
				data,
				errors
			});
		}

		try {
			const { name, amount, category, expenseDate, description } = validation.data;

			// Check if the submitted date is today. If so, use the current time.
			// Otherwise, use the date provided (which will be at midnight).
			const today = new Date();
			const submittedDate = new Date(expenseDate);
			const finalExpenseDate =
				new Date(expenseDate).toDateString() === today.toDateString() ? today : submittedDate;

			await db.insert(expenses).values({
				name,
				amount,
				category: category || null,
				expenseDate: finalExpenseDate,
				description: description || null
			});
			return { success: true, message: 'Expense added successfully!' };
		} catch (error) {
			// Log the actual error to the server console for debugging
			console.error('Failed to add expense:', error);
			return fail(500, { data, message: 'Could not add the expense.' });
		}
	},

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