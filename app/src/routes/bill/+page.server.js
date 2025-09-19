import { db } from '$lib/server/db';
import { menuItems } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// @type {import('./$types').PageServerLoad} 
export const load = async ({ url }) => {
	const category = url.searchParams.get('category');

	const items = await db.query.menuItems.findMany({
		where: category ? eq(menuItems.category, category) : undefined
	});

	return { menuItems: items };
};