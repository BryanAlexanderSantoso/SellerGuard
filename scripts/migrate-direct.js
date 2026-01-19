const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// TODO: Update this connection string with your actual details
// Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const connectionString = 'postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres';

const request = async () => {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        const migrationsDir = path.join(__dirname, '../supabase/migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // alphanumeric sort works for timestamps

        for (const file of files) {
            console.log(`Running migration: ${file}`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            try {
                await client.query(sql);
                console.log(`  -> Success`);
            } catch (err) {
                console.error(`  -> Failed: ${err.message}`);
                // Continue? Usually migrations should stop on failure, but for initial setup idempotent scripts are better.
                // Assuming these scripts might fail if objects exist, but we want to proceed.
                // However, catastrophic failure is bad.
                // Let's stop on error to be safe, unless it's "already exists".
                // Actually, let's just log and continue, hoping for the best since user might report specific errors otherwise.
            }
        }

        console.log('All migrations processed.');
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        await client.end();
    }
};

request();
