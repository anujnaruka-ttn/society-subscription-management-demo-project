"use client"

import PaymentEntryTable from "@/components/Tables/Admin/PaymentEntry";
import CommonHeader from "../common/CommonHeader";

const PaymentEntryClient = () => {
    return (
        <CommonHeader title="Payment Entry" description="Record and manage manual subscription payments from residents">
            <PaymentEntryTable />
        </CommonHeader >
    )
}

export default PaymentEntryClient;