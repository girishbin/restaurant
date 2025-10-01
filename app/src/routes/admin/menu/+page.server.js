import { menuItems } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { formSchema } from './schema.js';
import { eq, and, like, asc, desc } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { db } = locals;

	// Get sorting and filtering params from URL
	const sortBy = url.searchParams.get('sort') ?? 'createdAt';
	const sortOrder = url.searchParams.get('order') ?? 'desc';
	const categoryFilter = url.searchParams.get('category');
	const searchQuery = url.searchParams.get('search');

	// Build dynamic filters
	const filters = [];
	if (categoryFilter) {
		filters.push(eq(menuItems.category, categoryFilter));
	}
	if (searchQuery) {
		// Use `ilike` for case-insensitive search if your DB supports it (e.g., PostgreSQL)
		// For simplicity, `like` is used here.
		filters.push(like(menuItems.name, `%${searchQuery}%`));
	}

	// Define valid sortable columns to prevent arbitrary column sorting
	const validSortColumns = ['name', 'category', 'price', 'createdAt'];
	const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
	const orderFunction = sortOrder === 'asc' ? asc : desc;

	const items = await db.query.menuItems.findMany({
		where: filters.length > 0 ? and(...filters) : undefined,
		orderBy: [orderFunction(menuItems[sortColumn])]
	});

	// Return items and current state for the UI
	return { items, sortBy, sortOrder, categoryFilter, searchQuery, url: url.href };
};

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// Manually convert 'on'/'off' from checkbox to boolean
		const isActive = data.isActive === 'on';

		const result = formSchema.safeParse({ ...data, isActive });

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				data,
				errors,
				message: 'Validation failed. Please check the fields.'
			});
		}

		try {
			await db.insert(menuItems).values(result.data);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Could not create the menu item.' });
		}

		return { success: true };
	},

	update: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const id = Number(data.id);
		if (isNaN(id)) {
			return fail(400, { message: 'Invalid Item ID.' });
		}

		// Manually convert 'on'/'off' from checkbox to boolean
		const isActive = data.isActive === 'on';

		const result = formSchema.safeParse({ ...data, isActive });

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				data,
				errors,
				message: 'Validation failed. Please check the fields.'
			});
		}

		try {
			await db.update(menuItems).set(result.data).where(eq(menuItems.id, id));
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Could not update the menu item.' });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (isNaN(id)) {
			return fail(400, { message: 'Invalid Item ID.' });
		}

		try {
			await db.delete(menuItems).where(eq(menuItems.id, id));
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Could not delete the menu item.' });
		}

		return { success: true };
	}
};
