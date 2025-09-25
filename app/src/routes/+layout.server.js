/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	// Pass the user data from `locals` to the page
	return { user: locals.user };
}
