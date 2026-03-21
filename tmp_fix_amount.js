const { Client } = require('pg');
require('dotenv').config({ path: 'server-ssm-demo-p/.env' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
    await client.connect();

    const res = await client.query(`
        SELECT f.id, f.flat_type, f.residents, s.monthly_rate
        FROM users u
        JOIN flats f ON f.owner_id = u.id
        LEFT JOIN subscriptions s ON s.flat_type = f.flat_type
        WHERE u.email = 'jaya.thakur77@example.com'
    `);

    console.table(res.rows);

    if (res.rows.length === 0) return;

    const row = res.rows[0];
    const rate = row.monthly_rate;

    // Update amount_due
    await client.query(`
        UPDATE billing_records
        SET amount_due = $1
        WHERE flat_id = $2 AND status = 'pending'
    `, [rate, row.id]);

    console.log(`Updated pending amounts to \${rate} for Jaya's flat.`);

    await client.end();
}

run().catch(console.error);
