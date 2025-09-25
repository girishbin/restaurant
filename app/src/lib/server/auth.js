import { users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

/**
 * Finds a user by their username.
 * @param {import('drizzle-orm/sqlite-core').SQLiteDatabase} db The database instance.
 * @param {string} username The username to search for.
 * @returns {Promise<import('$lib/server/db/schema').UserSelect | undefined>} The user object if found.
 */
export async function findUserByUsername(db, username) {
	return await db.select().from(users).where(eq(users.username, username)).get();
}

/**
 * Finds a user by their ID.
 * @param {import('drizzle-orm/sqlite-core').SQLiteDatabase} db The database instance.
 * @param {number} id The user ID to search for.
 * @returns {Promise<Pick<import('$lib/server/db/schema').UserSelect, "id" | "username" | "role"> | undefined>} The user object if found.
 */
export async function findUserById(db, id) {
	// We only select the fields that are safe to expose and use in `event.locals`
	return await db
		.select({
			id: users.id,
			username: users.username,
			role: users.role
		})
		.from(users)
		.where(eq(users.id, id))
		.get();
}

export async function comparePassword(password, hash) {
	return await bcryptjs.compare(password, hash);
}
