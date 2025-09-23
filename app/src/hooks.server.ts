import { drizzle } from 'drizzle-orm/d1';
import type { Handle } from '@sveltejs/kit';
import * as schema from '$lib/server/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	// When running on Cloudflare (or with `wrangler dev`), `event.platform` is available.
	if (event.platform?.env.DB) {
		const db = drizzle(event.platform.env.DB, { schema });
		event.locals.db = db;
	}

	return resolve(event);
};

