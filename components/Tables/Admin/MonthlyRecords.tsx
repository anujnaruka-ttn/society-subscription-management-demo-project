"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { getAllBillingRecords, deleteBillingRecord, getBillingRecordsByMonth } from "@/lib/billingApis";
import { getMonthlyRecordsColumns } from "./Columns/MonthlyRecordsColumns";
import { useDataTable } from "@/hooks/use-data-table";

import { ConfigProvider, DatePicker, theme as antdtheme } from "antd";
import { useTheme } from "next-themes";
import { CommonTable } from "../Common/CommonTable";

export default function MonthlyRecordsTable() {
    const dispatch = useDispatch();
    const billingRecords = useSelector((state: RootState) => state.billing.billingRecords);
    const loading = useSelector((state: RootState) => state.billing.loading);

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

    const { table, globalFilter, setGlobalFilter } = useDataTable({
        data: billingRecords,
        columns,
        getRowId: (row) => row.id,
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
