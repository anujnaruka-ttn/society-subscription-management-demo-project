import cron from 'node-cron';
import { getMonthlyBilling } from '../services/billing.service';

/**
 * Node-Cron Monthly Billing Job
 * 
 * Uses node-cron library for professional scheduling
 * Schedule: Run on 1st of every month at 12:00 AM
 */

// Create the monthly billing task
const monthlyBillingTask = cron.schedule('0 0 1 * *', async () => {
    console.log('Cron job triggered - calling billing service...');
    await getMonthlyBilling();
}, {
    timezone: 'Asia/Kolkata'
});

// Start the cron job
monthlyBillingTask.start();

console.log('Monthly billing cron job started');

// Use getNextRun() to see the next scheduled execution
const nextRun = monthlyBillingTask.getNextRun();
console.log('Next run: ' + nextRun?.toLocaleString());

