// Dashboard queries for charts and statistics

const GET_DASHBOARD_MONTHLY_STATS = `
    SELECT 
        TO_CHAR(DATE_TRUNC('month', p.payment_date), 'YYYY-MM-DD') as date,
        COUNT(DISTINCT f.id) as flats,
        SUM(p.amount_paid) as amount
    FROM payments p
    JOIN billing_records br ON p.bill_id = br.id
    JOIN flats f ON br.flat_id = f.id
    WHERE p.payment_status = 'success'
      AND p.payment_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
    GROUP BY DATE_TRUNC('month', p.payment_date)
    ORDER BY date DESC
    LIMIT 12;
`;

const GET_DASHBOARD_MONTHLY_FLATS_STATS = `
    SELECT 
        TO_CHAR(DATE_TRUNC('month', p.payment_date), 'YYYY-MM-DD') as date,
        COUNT(DISTINCT f.id) as flats
    FROM payments p
    JOIN billing_records br ON p.bill_id = br.id
    JOIN flats f ON br.flat_id = f.id
    WHERE p.payment_status = 'success'
      AND p.payment_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
    GROUP BY DATE_TRUNC('month', p.payment_date)
    ORDER BY date DESC
    LIMIT 12;
`;

const GET_DASHBOARD_MONEY_COLLECTED = `
    SELECT 
        EXTRACT(EPOCH FROM DATE_TRUNC('day', p.payment_date)) * 1000 as timestamp,
        SUM(p.amount_paid) / 1000 as amount -- Convert to thousands for better display
    FROM payments p
    JOIN billing_records br ON p.bill_id = br.id
    WHERE p.payment_status = 'success'
      AND p.payment_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY DATE_TRUNC('day', p.payment_date)
    ORDER BY timestamp ASC;
`;

export {
    GET_DASHBOARD_MONTHLY_STATS,
    GET_DASHBOARD_MONTHLY_FLATS_STATS,
    GET_DASHBOARD_MONEY_COLLECTED
};
