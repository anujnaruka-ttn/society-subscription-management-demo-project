"use client";

import MonthlyRecordsTable from '@/components/Tables/Admin/MonthlyRecords';
import CommonAdminClient from "../common/CommonAdminClient";

const MonthlyRecordsClient = () => {
    return (
        <CommonAdminClient title="Monthly Subscription Records" description="View and manage monthly collection records and payment statuses">
            <MonthlyRecordsTable />
        </CommonAdminClient>
    )
}

export default MonthlyRecordsClient;