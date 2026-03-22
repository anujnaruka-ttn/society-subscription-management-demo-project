"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/stores/store";
import { getResidentSubscriptions, setPaymentStatus } from "@/lib/residentApis";
import { getResidentSubscriptionsColumns } from "./Columns/ResidentSubscriptionsColumns";
import { useDataTable } from "@/hooks/use-data-table";
import { CommonTable } from "../Common/CommonTable";
import { toast } from "sonner";

const EMPTY_RECORDS: any[] = [];

interface ResidentSubscriptionsTableProps {
    paymentId?: string | null;
    month?: string | null;
}

export default function ResidentSubscriptionsTable({ paymentId, month }: ResidentSubscriptionsTableProps) {
    const dispatch = useDispatch<AppDispatch>();
    const records = useSelector((state: RootState) => state.residentSubscriptionBilling?.records ?? EMPTY_RECORDS);
    const loading = useSelector((state: RootState) => state.residentSubscriptionBilling?.loading ?? false);
    const [processedPaymentId, setProcessedPaymentId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getResidentSubscriptions() as any);
    }, [dispatch]);

    useEffect(() => {
        if (paymentId && paymentId !== processedPaymentId) {
            toast.success(`Payment successful! Payment ID: ${paymentId}`);
            console.log("Payment ID received:", paymentId);
            
            // Find the specific record for this month/year if provided, otherwise use first record
            let targetRecord = null;
            let monthNum, yearNum;
            
            if (month) {
                const [year, monthStr] = month.split('-');
                monthNum = monthStr;
                yearNum = year;
                targetRecord = records.find(record => 
                    record.billing_year === parseInt(year) && 
                    record.billing_month === parseInt(monthStr)
                );
            } else {
                targetRecord = records[0];
                if (targetRecord) {
                    monthNum = targetRecord.billing_month.toString();
                    yearNum = targetRecord.billing_year.toString();
                }
            }
            
            if (targetRecord && monthNum && yearNum) {
                dispatch(setPaymentStatus(paymentId, targetRecord.flat_id, monthNum, yearNum) as any);
                setProcessedPaymentId(paymentId); // Mark as processed to prevent infinite loop
            }
        }
    }, [paymentId, month, dispatch, records, processedPaymentId]);

    const columns = getResidentSubscriptionsColumns();

    const { table, globalFilter, setGlobalFilter } = useDataTable({
        data: records,
        columns,
    });

    return (
        <CommonTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by month, status..."
            className="h-[calc(100vh-200px)] pt-1.5 pb-6"
        />
    );
}
