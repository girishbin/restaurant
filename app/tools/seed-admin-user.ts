import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';
import 'dotenv/config'; // Load environment variables from .env

if (process.env.NODE_ENV === 'production') {
	console.error('❌ Refusing to run seed script in production environment.');
	process.exit(1);
}
/**
 * This script is used to seed the database with initial data.
 * It's configured to run against a local SQLite file, which is a common pattern
 * for development and seeding with Drizzle and Cloudflare D1.
 *
 * Make sure your `drizzle.config.ts` points to a local database file.
 * Example `drizzle.config.ts`:
 * export default {
 *   schema: './src/lib/server/db/schema.ts',
 *   out: './drizzle',
 *   driver: 'better-sqlite',
 *   dbCredentials: {
 *     url: './sqlite.db', // This is the local database file
 *   },
 * };
 */

const dbPath = process.env.DATABASE_PATH;
if (!dbPath) {
	console.error('❌ DATABASE_PATH environment variable is not set.');
	process.exit(1);
}

const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword) {
	console.error('❌ ADMIN_PASSWORD environment variable is not set.');
	process.exit(1);
}

const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function seed() {
	console.log('🌱 Seeding database...');
	const adminUsername = 'admin';

	// 1. Check if the admin user already exists
	const existingAdmin = await db.query.users.findFirst({
		where: eq(schema.users.username, adminUsername)
	});

	if (existingAdmin) {
		console.log('✅ Admin user already exists. Skipping.');
	} else {
		// 2. Hash the password
		const hashedPassword = await bcryptjs.hash(adminPassword, 6);

		// 3. Insert the admin user
		await db.insert(schema.users).values({
			username: adminUsername,
			password: hashedPassword,
			role: 'admin'
		});
		console.log('✅ Admin user created successfully.');
	}

	console.log('🌱 Seeding complete.');
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Error during seeding:', error);
	process.exit(1);
});
