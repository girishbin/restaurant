import { db } from '$lib/server/db';
import { menuItems } from '$lib/server/db/schema.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const categoriesResult = await db
		.selectDistinct({ category: menuItems.category })
		.from(menuItems);
	const categories = categoriesResult.map((c) => c.category).filter(Boolean);
	return { categories };
}