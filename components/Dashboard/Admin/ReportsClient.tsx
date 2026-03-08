"use client"

import CommonAdminClient from "../common/CommonAdminClient";
import Reports from "./Reports";

const ReportsClient = () => {
    return (
        <CommonAdminClient
            title="Reports"
            description="Generates monthly and yearly financial reports."
        >
            <Reports />
        </CommonAdminClient>
    )
}

export default ReportsClient;