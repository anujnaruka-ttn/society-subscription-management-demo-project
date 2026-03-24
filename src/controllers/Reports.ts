import { Request, Response } from 'express';
import { query } from '../config/db';
import { catchAsync } from '../utils/catchAsync';
import { error, success } from '../utils/response';
import { AsyncParser } from '@json2csv/node';
import PDFDocument from 'pdfkit-table';
import { ReportBodyInput } from '../validations/reports.validation';
import { getPendingPayments } from '../services/payment.service';
import { IReport } from '../models/IReport';

// Get total collection summary
const getCollectionSummary = async (month?: number, year?: number) => {
    let whereClause = 'WHERE p.payment_status = $1';  // Change from 'completed' to use parameter
    let params: any[] = ['success'];

    if (month && year) {
        whereClause += ' AND p.payment_date >= $2 AND p.payment_date <= $3';
        params = [
            'success',
            `${year}-${String(month).padStart(2, '0')}-01`,
            `${year}-${String(month).padStart(2, '0')}-31`
        ];
    } else if (year) {
        whereClause += ' AND p.payment_date >= $2 AND p.payment_date <= $3';
        params = [
            'success',
            `${year}-01-01`,
            `${year}-12-31`
        ];
    }

    const summaryQuery = `
        SELECT 
            COUNT(*) as total_transactions,
            SUM(p.amount_paid) as total_collected,
            COUNT(DISTINCT p.bill_id) as unique_bills_paid,
            AVG(p.amount_paid) as average_payment,
            MAX(p.amount_paid) as highest_payment,
            MIN(p.amount_paid) as lowest_payment
        FROM payments p
        ${whereClause}
    `;

    const result = await query(summaryQuery, params);
    return result.rows[0];
};

// Get payment mode breakdown
const getPaymentModeBreakdown = async (month?: number, year?: number) => {
    let whereClause = 'WHERE p.payment_status = $1';
    let params: any[] = ['success'];

    if (month && year) {
        whereClause += ' AND p.payment_date >= $2 AND p.payment_date <= $3';
        params = [
            'success',
            `${year}-${String(month).padStart(2, '0')}-01`,
            `${year}-${String(month).padStart(2, '0')}-31`
        ];
    } else if (year) {
        // For yearly reports, filter by year only
        whereClause += ' AND p.payment_date >= $2 AND p.payment_date <= $3';
        params = [
            'success',
            `${year}-01-01`,
            `${year}-12-31`
        ];
    }

    const breakdownQuery = `
        SELECT 
            p.payment_mode,
            COUNT(*) as transaction_count,
            SUM(p.amount_paid) as total_amount,
            ROUND((SUM(p.amount_paid) * 100.0 / 
                (SELECT SUM(amount_paid) FROM payments p2 
                 WHERE p2.payment_status = 'success'
                 ${month && year ? `AND p2.payment_date >= '${year}-${String(month).padStart(2, '0')}-01' AND p2.payment_date <= '${year}-${String(month).padStart(2, '0')}-31'` : ''}
                 ${year && !month ? `AND p2.payment_date >= '${year}-01-01' AND p2.payment_date <= '${year}-12-31'` : ''}
                )), 2) as percentage
        FROM payments p
        ${whereClause}
        GROUP BY p.payment_mode
        ORDER BY total_amount DESC
    `;

    const result = await query(breakdownQuery, params);
    return result.rows;
};

// Save report record to database
const saveReportRecord = async (reportData: Partial<IReport>) => {
    const insertQuery = `
            INSERT INTO report_records (
                format, range, month, year, file_name, file_path, file_size, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    
    const result = await query(insertQuery, [
        reportData.format,
        reportData.range,
        reportData.month,
        reportData.year,
        reportData.file_name,
        reportData.file_path,
        reportData.file_size,
        reportData.status || 'completed',
        // reportData.generated_by
    ]);
    
    return result.rows[0];
};
// Get all report records
const getReportRecords = catchAsync(
    async (_req: Request, res: Response) => {
        try {
            const recordsQuery = `
                SELECT 
                    rr.*,
                    u.name as generated_by_name,
                    u.email as generated_by_email
                FROM report_records rr
                LEFT JOIN users u ON rr.generated_by = u.id
                ORDER BY rr.created_at DESC
            `;
            
            const result = await query(recordsQuery);
            
            return success(res, 'Report records fetched successfully', result.rows);
        } catch (err) {
            console.error('Error fetching report records:', err);
            return error(res, 'Failed to fetch report records', 500, err);
        }
    }
);

// Generate CSV content helper
const generateCSVContent = async (summary: any, breakdown: any[], pending: any[]) => {
    const csvData = [
        // Summary Section
        { section: 'TOTAL COLLECTION SUMMARY', metric: 'Total Transactions', value: summary.total_transactions },
        { section: 'TOTAL COLLECTION SUMMARY', metric: 'Total Collected', value: summary.total_collected },
        { section: 'TOTAL COLLECTION SUMMARY', metric: 'Unique Bills Paid', value: summary.unique_bills_paid },
        { section: 'TOTAL COLLECTION SUMMARY', metric: 'Average Payment', value: summary.average_payment },
        { section: 'TOTAL COLLECTION SUMMARY', metric: 'Highest Payment', value: summary.highest_payment },
        { section: 'TOTAL COLLECTION SUMMARY', metric: 'Lowest Payment', value: summary.lowest_payment },
        
        // Payment Mode Breakdown
        ...breakdown.map(item => ({
            section: 'PAYMENT MODE BREAKDOWN',
            metric: item.payment_mode,
            value: `${item.transaction_count} transactions - ₹${item.total_amount} (${item.percentage}%)`
        })),
        
        // Pending Payments
        ...pending.map(item => ({
            section: 'PENDING PAYMENTS',
            metric: `${item.resident} - ${item.flatAddress}`,
            value: `₹${item.amount} (${item.billing_month}/${item.billing_year})`
        }))
    ];

    const opts = {
        fields: ['section', 'metric', 'value'],
        header: true
    };
    
    const transformOpts = {};
    const asyncOpts = {};
    const parser = new AsyncParser(opts, asyncOpts, transformOpts);
    
    return await parser.parse(csvData).promise();
};

// Generate PDF content helper
const generatePDFContent = async (doc: any, summary: any, breakdown: any[], pending: any[], range: string, month?: string, year?: string) => {
    doc.fontSize(20).text('Society Management Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`${(range as string)?.toUpperCase() || 'MONTHLY'} REPORT - ${month || 'All Months'} ${year || new Date().getFullYear()}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(16).text('TOTAL COLLECTION SUMMARY', { underline: true });
    doc.moveDown();
    
    const summaryTable = {
        title: '',
        headers: ['Metric', 'Value'],
        rows: [
            ['Total Transactions', summary.total_transactions?.toString() || '0'],
            ['Total Collected', `₹${summary.total_collected || 0}`],
            ['Unique Bills Paid', summary.unique_bills_paid?.toString() || '0'],
            ['Average Payment', `₹${summary.average_payment || 0}`],
            ['Highest Payment', `₹${summary.highest_payment || 0}`],
            ['Lowest Payment', `₹${summary.lowest_payment || 0}`]
        ]
    };

    await doc.table(summaryTable, {
        width: 500,
        padding: [5, 5, 5, 5],
    });
    doc.moveDown(2);

    doc.fontSize(16).text('PAYMENT MODE BREAKDOWN', { underline: true });
    doc.moveDown();
    
    const breakdownTable = {
        title: '',
        headers: ['Payment Mode', 'Transactions', 'Amount', 'Percentage'],
        rows: breakdown.map(item => [
            item.payment_mode,
            item.transaction_count?.toString() || '0',
            `₹${item.total_amount || 0}`,
            `${item.percentage || 0}%`
        ])
    };

    await doc.table(breakdownTable, {
        width: 500,
        padding: [5, 5, 5, 5]
    });
    doc.moveDown(2);

    doc.fontSize(16).text('PENDING PAYMENTS', { underline: true });
    doc.moveDown();
    
    const pendingTable = {
        title: '',
        headers: ['Resident', 'Flat Address', 'Amount', 'Month/Year'],
        rows: pending.map(item => [
            item.resident || 'N/A',
            item.flatAddress || 'N/A',
            `₹${item.amount || 0}`,
            `${item.billing_month}/${item.billing_year}`
        ])
    };

    await doc.table(pendingTable, {
        width: 500,
        padding: [5, 5, 5, 5]
    });
};

// Single endpoint for both CSV and PDF
const generateReport = catchAsync(
    async (req: Request, res: Response) => {
        const { format, range, month, year } = req.body as ReportBodyInput;
        // const userId = (req as CustomRequest).user?.id;
        
        // Get data
        const [summary, breakdown, pending] = await Promise.all([
            getCollectionSummary(
                month ? Number(month) : undefined, 
                year ? Number(year) : undefined
            ),
            getPaymentModeBreakdown(
                month ? Number(month) : undefined, 
                year ? Number(year) : undefined
            ),
            getPendingPayments(
                month ? Number(month) : undefined, 
                year ? Number(year) : undefined
            )
        ]);

        if (format === 'csv') {
            // Generate CSV
            const csv = await generateCSVContent(summary, breakdown, pending);
            
            // Save report record
            await saveReportRecord({
                format: 'csv',
                range,
                month,
                year,
                file_name: `report-${range}-${month || 'all'}-${year || 'all'}.csv`,
                file_path: `/temp/reports/report-${range}-${month || 'all'}-${year || 'all'}.csv`,
                file_size: Buffer.byteLength(csv),
                // generated_by: userId
            });
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=report-${range}-${month || 'all'}-${year || 'all'}.csv`);
            return res.send(csv);
        } else if (format === 'pdf') {
            // Generate PDF
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=report-${range}-${month || 'all'}-${year || 'all'}.pdf`);
            doc.pipe(res);
            
            await generatePDFContent(doc, summary, breakdown, pending, range || 'monthly', month, year);
            
            // Get PDF size (approximate)
            const chunks: any[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => {
                const pdfSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                
                // Save report record
                saveReportRecord({
                    format: 'pdf',
                    range,
                    month,
                    year,
                    file_name: `report-${range}-${month || 'all'}-${year || 'all'}.pdf`,
                    file_path: `/temp/reports/report-${range}-${month || 'all'}-${year || 'all'}.pdf`,
                    file_size: pdfSize,
                    // generated_by: userId
                });
            });
            
            doc.end();
        }
});

export {
    generateReport,
    getReportRecords
};