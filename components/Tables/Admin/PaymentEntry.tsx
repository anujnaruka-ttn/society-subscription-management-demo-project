"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDataTable } from "@/hooks/use-data-table";


import { getPaymentEntries } from "@/lib/paymentApis";
import { CommonTable } from "../Common/CommonTable";
import { paymentEntryColumns } from "./Columns/PaymentEntryColumns";

export default function PaymentEntryTable() {
    const dispatch = useDispatch();
    const { paymentEntries, loading } = useSelector((state: any) => state.adminPayment);

    useEffect(() => {
        dispatch(getPaymentEntries() as any);
    }, [dispatch]);

    const { table, globalFilter, setGlobalFilter } = useDataTable({
        data: paymentEntries || [],
        columns: paymentEntryColumns,
    });


    return (
        <CommonTable
            table={table}
            loading={loading}
            columnsCount={paymentEntryColumns.length}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            className="w-[98%] mx-auto h-[calc(100vh-64px)] pt-0 pb-6 px-6"
            searchPlaceholder="Search residents, owner or flat..."
        />
    );
}
