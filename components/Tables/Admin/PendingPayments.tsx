"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { getPendingPayments } from "@/lib/paymentApis";
import {
    type SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "../Common/CommonTable";
import { pendingPaymentColumns } from "./Columns/PendingPaymentColumns";

export default function PendingPaymentsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.adminPayment.pendingPayments);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        dispatch(getPendingPayments());
    }, [dispatch]);

    const table = useReactTable({
        data,
        columns: pendingPaymentColumns,
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
            columnsCount={pendingPaymentColumns.length}
            globalFilter={globalFilter}
            className="p-1 h-full flex flex-col"
        />
    );
}
