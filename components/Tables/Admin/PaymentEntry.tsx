"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
} from "@tanstack/react-table";

import { getPaymentEntries } from "@/lib/paymentApis";
import { CommonTable } from "../Common/CommonTable";
import { paymentEntryColumns } from "./Columns/PaymentEntryColumns";

export default function PaymentEntryTable() {
    const dispatch = useDispatch();
    const { paymentEntries, loading } = useSelector((state: any) => state.adminPayment);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        dispatch(getPaymentEntries() as any);
    }, [dispatch]);

    const table = useReactTable({
        data: paymentEntries || [],
        columns: paymentEntryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: {
            sorting,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: { pageSize: 10 },
        },
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
