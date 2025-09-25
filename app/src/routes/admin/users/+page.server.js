import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import bcryptjs from 'bcryptjs';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// Admins can only manage 'user' roles, so we filter for them.
	const userList = await locals.db.query.users.findMany({
		where: eq(users.role, 'user'),
		// Only select columns that are safe and necessary for display
		columns: {
			id: true,
			username: true,
			createdAt: true
		},
		orderBy: (users, { desc }) => [desc(users.createdAt)]
	});

	return { users: userList };
}

/** @type {import('./$types').Actions} */
export const actions = {
	addUser: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		// --- Validation ---
		if (typeof username !== 'string' || !username) {
			return fail(400, { success: false, message: 'Username is required.' });
		}

		if (typeof password !== 'string' || password.length < 6) {
			return fail(400, { success: false, message: 'Password must be at least 6 characters long.' });
		}

		// --- Check for existing user ---
		const existingUser = await locals.db.query.users.findFirst({
			where: eq(users.username, username)
		});

		if (existingUser) {
			return fail(400, { success: false, message: `Username "${username}" is already taken.` });
		}

		// --- Create user ---
		const hashedPassword = await bcryptjs.hash(password, 10);
		await locals.db.insert(users).values({
			username,
			password: hashedPassword,
			role: 'user' // Explicitly set role to 'user'
		});

		return { success: true, message: `User "${username}" created successfully.` };
	}
};