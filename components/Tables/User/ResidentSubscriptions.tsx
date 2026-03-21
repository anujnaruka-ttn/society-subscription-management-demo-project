"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/stores/store";
import { getResidentSubscriptions } from "@/lib/residentApis";
import { getResidentSubscriptionsColumns } from "./Columns/ResidentSubscriptionsColumns";
import { useDataTable } from "@/hooks/use-data-table";
import { CommonTable } from "../Common/CommonTable";

const EMPTY_RECORDS: any[] = [];

export default function ResidentSubscriptionsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const records = useSelector((state: RootState) => state.residentSubscriptionBilling?.records ?? EMPTY_RECORDS);
    const loading = useSelector((state: RootState) => state.residentSubscriptionBilling?.loading ?? false);

    useEffect(() => {
        dispatch(getResidentSubscriptions() as any);
    }, [dispatch]);

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
