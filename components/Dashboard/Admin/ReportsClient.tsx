"use client"

import CommonHeader from "../common/CommonHeader";
import Reports from "./Reports";

const ReportsClient = () => {
    return (
        <CommonHeader
            title="Reports"
            description="Generates monthly and yearly financial reports."
        >
            <Reports />
        </CommonHeader>
    )
}

export default ReportsClient;