import { query } from "../config/db";
import { 
    GET_DASHBOARD_MONTHLY_STATS, 
    GET_DASHBOARD_MONTHLY_FLATS_STATS, 
    GET_DASHBOARD_MONEY_COLLECTED 
} from "../queries/dashboard.queries";

const getDashboardMonthChartStats = async () => {
    const result = await query(GET_DASHBOARD_MONTHLY_STATS);
    return result.rows;
};

const getDashboardMonthWiseFlatsStats = async () => {
    const result = await query(GET_DASHBOARD_MONTHLY_FLATS_STATS);
    return result.rows;
};

const getDashboardMoneyCollectedStats = async () => {
    const result = await query(GET_DASHBOARD_MONEY_COLLECTED);
    
    // Transform data for ApexCharts format [timestamp, value]
    return result.rows.map(row => [row.timestamp, row.amount]);
};

export {
    getDashboardMonthChartStats,
    getDashboardMonthWiseFlatsStats,
    getDashboardMoneyCollectedStats
};
