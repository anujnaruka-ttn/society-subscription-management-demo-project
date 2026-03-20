"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { getAllBillingRecords, deleteBillingRecord, getBillingRecordsByMonth } from "@/lib/billingApis";
import { getMonthlyRecordsColumns } from "./Columns/MonthlyRecordsColumns";
import {
    type SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ConfigProvider, DatePicker, theme as antdtheme } from "antd";
import { useTheme } from "next-themes";
import { CommonTable } from "../Common/CommonTable";

export default function MonthlyRecordsTable() {
    const dispatch = useDispatch();
    const billingRecords = useSelector((state: RootState) => state.billing.billingRecords);
    const loading = useSelector((state: RootState) => state.billing.loading);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const { theme: nextTheme } = useTheme();
    const { defaultAlgorithm, darkAlgorithm } = antdtheme;

    // Fetch billing records on mount
    useEffect(() => {
        dispatch(getAllBillingRecords() as any);
    }, [dispatch]);

    const handleDelete = (id: string) => {
        dispatch(deleteBillingRecord(id) as any);
    };

    const columns = getMonthlyRecordsColumns(handleDelete);

    const table = useReactTable({
        data: billingRecords,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row) => row.id,
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
            columnsCount={columns.length}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            className="h-[calc(100vh-64px)] pt-1.5 pb-6 px-6"
            topExtra={
                <ConfigProvider
                    theme={{
                        algorithm: nextTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
                    }}
                >
                    <DatePicker
                        style={{
                            backgroundColor: "transparent",
                        }}
                        picker="month"
                        onChange={(value: any) => {
                            if (value) {
                                const month = value.month() + 1;
                                const year = value.year();
                                dispatch(getBillingRecordsByMonth(month, year) as any);
                            }
                        }}
                        className="h-8 md:w-full w-64 md:flex-1"
                    />
                </ConfigProvider>
            }
        />
    );
}
