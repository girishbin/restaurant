// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	dialect: 'sqlite', // D1 uses a SQLite-compatible engine
	driver: 'd1-http',
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_API_TOKEN!
	}
} satisfies Config;
