import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema.js';
import { menuItems } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	// 1. Initialize the form on page load
	const form = await superValidate(zod(formSchema));

	// 2. Fetch all existing menu items, ordered by most recently created
	const items = await locals.db.query.menuItems.findMany({
		orderBy: [desc(menuItems.createdAt)]
	});

	// 3. Return both the form and the items to the page
	return { form, items };
};

export const actions = {
	// 3. Handle the default form submission
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(formSchema));

		// 4. If validation fails, return the form with errors
		if (!form.valid) {
			return fail(400, { form });
		}

		// 5. If validation is successful, insert the data into the database
		try {
			await locals.db.insert(menuItems).values(form.data);
		} catch (e) {
			console.error('Error inserting menu item:', e);
			return message(form, 'An error occurred while adding the menu item.', { status: 500 });
		}

		// 6. Return a success message
		return message(form, 'Menu item added successfully!');
	}
};