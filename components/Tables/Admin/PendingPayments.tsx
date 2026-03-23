"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { getPendingPayments } from "@/lib/paymentApis";
import { useDataTable } from "@/hooks/use-data-table";

import { CommonTable } from "../Common/CommonTable";
import { pendingPaymentColumns } from "./Columns/PendingPaymentColumns";

export default function PendingPaymentsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.adminPayment.pendingPayments);

    useEffect(() => {
        dispatch(getPendingPayments());
    }, [dispatch]);

    const { table, globalFilter } = useDataTable({
        data,
        columns: pendingPaymentColumns,
    });

    return (
        <CommonTable
            table={table}
            columnsCount={pendingPaymentColumns.length}
            globalFilter={globalFilter}
            className="p-1 h-full flex flex-col"
        />
    );
}
