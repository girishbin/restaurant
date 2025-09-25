import fs from 'fs';

const inputFile = './d1-backup.sql'; // The file from `wrangler d1 export`
const outputFile = './d1-backup-fixed.sql'; // The file to be used with `wrangler d1 execute`

function fixD1Backup() {
	console.log(`Reading from ${inputFile}...`);
	if (!fs.existsSync(inputFile)) {
		console.error(`Error: Input file not found at ${inputFile}`);
		process.exit(1);
	}

	const content = fs.readFileSync(inputFile, 'utf-8');

	// This regex finds unquoted ISO 8601 date strings in your SQL file.
	const isoDateRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)/g;

	const fixedContent = content.replace(isoDateRegex, (match) => {
		const date = new Date(match);
		// Convert the date string into a Unix timestamp (integer in seconds).
		return String(Math.floor(date.getTime() / 1000));
	});

	fs.writeFileSync(outputFile, fixedContent);
	console.log(`\n✅ Backup file fixed!`);
	console.log(`📁 New file created: ${outputFile}`);
	console.log(`\nNext step:`);
	console.log(`  wrangler d1 execute tawa-kettles --local --file=${outputFile}`);
}

fixD1Backup();