"use client"

import PaymentEntryTable from "@/components/Tables/Admin/PaymentEntry";
import CommonAdminClient from "../common/CommonAdminClient";

const PaymentEntryClient = () => {
    return (
        <CommonAdminClient title="Payment Entry" description="Record and manage manual subscription payments from residents">
            <PaymentEntryTable />
        </CommonAdminClient >
    )
}

export default PaymentEntryClient;