const { Client } = require('pg');

const connectionString = 'postgresql://postgres.fahhslhjbyrgcqxjhgic:XWWt6COxaQQYDYus@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

async function fixProfiles() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to Supabase DB');

        const sql = `
            ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
        `;

        console.log('Adding full_name to profiles...');
        await client.query(sql);
        console.log('Success!');

    } catch (err) {
        console.error('Failed:', err);
    } finally {
        await client.end();
    }
}

fixProfiles();
