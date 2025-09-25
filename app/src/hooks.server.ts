import { drizzle } from 'drizzle-orm/d1';
import type { Handle } from '@sveltejs/kit';
import * as schema from '$lib/server/db/schema';

import { findUserById } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// When running on Cloudflare (or with `wrangler dev`), `event.platform` is available.
	// 1. Initialize Database Connection
	if (event.platform?.env.DB) {
		const db = drizzle(event.platform.env.DB, { schema });
		event.locals.db = db;
	}

	// 2. Authentication: Get user from session cookie
	const sessionId = event.cookies.get('sessionId');

	if (sessionId) {
		// Find the user based on the session
		const user = await findUserById(event.locals.db, Number(sessionId));
		if (user) {
			// If the user is found, attach them to the event locals for access in pages/actions
			event.locals.user = user;
		}
	}

	const { pathname } = event.url;

	// 3. Authorization: Protect routes based on user role
	if (pathname.startsWith('/admin')) {
		// If no user is logged in, redirect to login
		if (!event.locals.user) {
			throw redirect(303, `/login?redirectTo=${pathname}`);
		}
		// If user is not an admin, redirect to a non-admin page
		if (event.locals.user.role !== 'admin') {
			throw redirect(303, '/bill'); // Or show an "unauthorized" page
		}
	}

	// Protect /bill routes
	// If no user is logged in, redirect to login
	if (pathname.startsWith('/bill')) {
		if (!event.locals.user) {
			throw redirect(303, `/login?redirectTo=${pathname}`);
		}
	}

	return resolve(event);
}
