import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
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
			return fail(400, { action: 'addUser', success: false, message: 'Username is required.' });
		}

		if (typeof password !== 'string' || password.length < 6) {
			return fail(400, {
				action: 'addUser',
				success: false,
				message: 'Password must be at least 6 characters long.'
			});
		}

		// --- Check for existing user ---
		const existingUser = await locals.db.query.users.findFirst({
			where: eq(users.username, username)
		});

		if (existingUser) {
			return fail(400, {
				action: 'addUser',
				success: false,
				message: `Username "${username}" is already taken.`
			});
		}

		// --- Create user ---
		const hashedPassword = await bcryptjs.hash(password, 10);
		await locals.db.insert(users).values({
			username,
			password: hashedPassword,
			role: 'user' // Explicitly set role to 'user'
		});

		return { action: 'addUser', success: true, message: `User "${username}" created successfully.` };
	},

	changePassword: async ({ request, locals }) => {
		const data = await request.formData();
		const userId = data.get('userId');
		const password = data.get('password');

		if (typeof password !== 'string' || password.length < 6) {
			return fail(400, {
				action: 'changePassword',
				success: false,
				message: 'Password must be at least 6 characters long.'
			});
		}

		if (!userId || typeof userId !== 'string') {
			return fail(400, { action: 'changePassword', success: false, message: 'Invalid user ID.' });
		}

		const userIdNum = Number(userId);
		if (userIdNum === locals.user?.id) {
			return fail(403, {
				action: 'changePassword',
				success: false,
				message: 'For security, you cannot change your own password from this page.'
			});
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		await locals.db.update(users).set({ password: hashedPassword }).where(eq(users.id, userIdNum));

		return { action: 'changePassword', success: true, message: 'Password updated successfully.' };
	},

	deleteUser: async ({ request, locals }) => {
		const data = await request.formData();
		const userId = data.get('userId');

		if (!userId || typeof userId !== 'string') {
			return fail(400, { action: 'deleteUser', success: false, message: 'Invalid user ID.' });
		}

		const userIdNum = Number(userId);
		if (userIdNum === locals.user?.id) {
			return fail(403, {
				action: 'deleteUser',
				success: false,
				message: 'You cannot delete your own account.'
			});
		}

		await locals.db.delete(users).where(eq(users.id, userIdNum));

		return { action: 'deleteUser', success: true, message: 'User deleted successfully.' };
	}
};