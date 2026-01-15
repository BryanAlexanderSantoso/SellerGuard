const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.fahhslhjbyrgcqxjhgic:XWWt6COxaQQYDYus@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to Supabase DB');

        const sqlPath = path.join(__dirname, '../supabase/migrations/20260114000001_add_disputes.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration: add_disputes...');
        await client.query(sql);
        console.log('Migration successful!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
