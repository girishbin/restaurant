// migrate-menu-items.js
import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

// PostgreSQL connection
const pgClient = new Client({
    host: 'localhost',
    port: 5432,
    database: 'restaurant',
    user: 'postgres',
    password: 'postgres',
  });

async function exportMenuItemsData() {
  await pgClient.connect();
  
  try {
    const tableName = 'menu_items';
    console.log(`Starting migration for table: ${tableName}`);
    
    // First, check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    
    const { rows: tableExists } = await pgClient.query(tableExistsQuery, [tableName]);
    
    if (!tableExists[0].exists) {
      console.error(`Table ${tableName} does not exist in the database.`);
      return;
    }
    
    // Get table structure for reference
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    const { rows: columns } = await pgClient.query(columnsQuery, [tableName]);
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Get all data from menu_items table
    const { rows: data } = await pgClient.query(`SELECT * FROM ${tableName} ORDER BY id`);
    
    if (data.length === 0) {
      console.log(`Table ${tableName} is empty, nothing to migrate.`);
      return;
    }
    
    console.log(`Found ${data.length} records in ${tableName}`);
    
    // Start with PRAGMA to disable foreign keys
    let allInsertStatements = 'PRAGMA foreign_keys = OFF;\n\n';
    allInsertStatements += `-- Migrating ${tableName} table (${data.length} records)\n`;
    allInsertStatements += `-- Generated on: ${new Date().toISOString()}\n\n`;
    
    // Generate INSERT statements
    let successCount = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            // Escape single quotes and handle special characters
            return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
          }
          if (value instanceof Date) {
            return `'${value.toISOString()}'`;
          }
          if (typeof value === 'boolean') {
            return value ? '1' : '0';
          }
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            // Handle JSON/JSONB columns
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          if (typeof value === 'number') {
            return isNaN(value) ? 'NULL' : value;
          }
          return `'${String(value)}'`;
        }).join(', ');
        
        allInsertStatements += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
        successCount++;
        
        // Progress indicator
        if ((i + 1) % 100 === 0) {
          console.log(`Processed ${i + 1}/${data.length} records...`);
        }
        
      } catch (error) {
        console.error(`Error processing record ${i + 1}:`, error);
        console.error('Problematic row:', row);
      }
    }
    
    // Re-enable foreign keys
    allInsertStatements += '\nPRAGMA foreign_keys = ON;\n';
    
    // Write to file
    const filename = 'menu_items_migration.sql';
    fs.writeFileSync(filename, allInsertStatements);
    
    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📁 File created: ${filename}`);
    console.log(`📊 Records processed: ${successCount}/${data.length}`);
    console.log(`\nNext steps:`);
    console.log(`1. Test locally: npx wrangler d1 execute your-database-name --local --file=./${filename}`);
    console.log(`2. If successful: npx wrangler d1 execute your-database-name --file=./${filename}`);
    
  } catch (error) {
    console.error('Error during export:', error);
  } finally {
    await pgClient.end();
  }
}

exportMenuItemsData();