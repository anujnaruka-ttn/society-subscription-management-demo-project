"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { getResidentSubscriptions } from "@/lib/residentApis";
import PaymentComponent from "@/components/common/PaymentComponent";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const flatId = searchParams.get("flatId");
    const month = searchParams.get("month"); // Get month parameter like "2026-03"
    const dispatch = useDispatch<AppDispatch>();
    const { records } = useSelector((state: RootState) => state.residentSubscriptionBilling);
    const [amount, setAmount] = useState<number>(1000);

    useEffect(() => {
        dispatch(getResidentSubscriptions());
    }, [dispatch]);

    useEffect(() => {
        if (records && flatId) {
            // Find the subscription record for this flatId
            const flatRecord = records.find(record => record.flat_id === flatId);
            if (flatRecord) {
                setAmount(flatRecord.amount_due);
            }
        }
    }, [records, flatId]);

    if (!flatId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Payment Link</h1>
                    <p className="text-muted-foreground">No flat ID provided for payment.</p>
                </div>
            </div>
        );
    }

    return (
        <PaymentComponent amount={amount} flatId={flatId} monthYear={month || undefined} />
    )
}
