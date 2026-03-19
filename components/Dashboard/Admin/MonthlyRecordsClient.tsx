"use client";

import MonthlyRecordsTable from '@/components/Tables/Admin/MonthlyRecords';
import CommonAdminClient from "../common/CommonAdminClient";
import CommonHeader from '../common/CommonHeader';

const MonthlyRecordsClient = () => {
    return (
        <CommonHeader title="Monthly Subscription Records" description="View and manage monthly collection records and payment statuses">
            <MonthlyRecordsTable />
        </CommonHeader>
    )
}

export default MonthlyRecordsClient;