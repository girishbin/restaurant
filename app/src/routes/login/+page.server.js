import { findUserByUsername } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, { message: 'Missing username or password' });
		}

		const user = findUserByUsername(username);

		// In a real app, use hashed passwords!
		if (!user || user.password !== password) {
			return fail(400, { message: 'Invalid credentials' });
		}

		// Set a session cookie
		cookies.set('sessionId', user.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // one week
		});

		// Redirect to the page the user was trying to access or a default
		const redirectTo = url.searchParams.get('redirectTo') || (user.role === 'admin' ? '/admin' : '/bill');

		throw redirect(303, redirectTo);
	},
	logout: async ({ cookies }) => {
		// Clear the session cookie
		cookies.delete('sessionId', { path: '/' });

		// Redirect to the login page
		throw redirect(303, '/login');
	}
};
