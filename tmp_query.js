const { Client } = require('pg');
require('dotenv').config({ path: 'server-ssm-demo-p/.env' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(() => {
    return client.query(`
        SELECT u.email, u.name, f.flat_number, br.billing_month, br.billing_year, br.amount_due 
        FROM users u 
        JOIN flats f ON f.owner_id = u.id 
        JOIN billing_records br ON br.flat_id = f.id 
        WHERE br.status = 'pending' AND u.role = 'resident' 
        LIMIT 5;
    `);
}).then(res => {
    console.table(res.rows);
    client.end();
}).catch(console.error);
