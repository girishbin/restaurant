import { settings } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

// Schema for validating settings form data
const settingsSchema = zfd.formData({
	cafeName: zfd.text(z.string().min(1, 'Cafe name is required')),
	cafeAddress: zfd.text(z.string().optional()),
	cafePhone: zfd.text(z.string().optional())
});

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { db } = locals;
	// Fetch the first (and only) settings record
	const currentSettings = await db.select().from(settings).limit(1);

	return {
		settings: currentSettings[0] || null
	};
}

/** @type {import('./$types').PageServerActions} */
export const actions = {
	default: async ({ request, locals }) => {
		const { db } = locals;
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const validation = settingsSchema.safeParse(formData);

		if (!validation.success) {
			const errors = validation.error.flatten().fieldErrors;
			return fail(400, { data, errors, message: 'Please check the form for errors.' });
		}

		try {
			const { cafeName, cafeAddress, cafePhone } = validation.data;
			const currentSettings = await db.select().from(settings).limit(1);

			if (currentSettings.length > 0) {
				// If settings exist, update them
				await db.update(settings).set({ cafeName, cafeAddress, cafePhone });
			} else {
				// If no settings exist, insert a new record
				await db.insert(settings).values({ cafeName, cafeAddress, cafePhone });
			}

			return { success: true, message: 'Settings updated successfully!' };
		} catch (error) {
			console.error('Failed to update settings:', error);
			return fail(500, { data, message: 'Could not update settings.' });
		}
	}
};