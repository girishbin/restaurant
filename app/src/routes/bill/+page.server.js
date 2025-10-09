import { menuItems } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

// @type {import('./$types').PageServerLoad}
export const load = async ({ url, locals }) => {
	const { db } = locals;
	const category = url.searchParams.get('category');

	// Always filter for active items, and add category filter if present.
	const filters = [eq(menuItems.isActive, true)];
	if (category) {
		filters.push(eq(menuItems.category, category));
	}

	const items = await db.query.menuItems.findMany({
		where: and(...filters)
	});

	return { menuItems: items };
};