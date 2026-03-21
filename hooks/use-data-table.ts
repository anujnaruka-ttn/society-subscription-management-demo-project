"use client";

import { useState } from "react";
import {
    type ColumnDef,
    type SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

interface UseDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    pageSize?: number;
    getRowId?: (row: TData) => string;
}

export function useDataTable<TData>({
    data,
    columns,
    pageSize = 10,
    getRowId,
}: UseDataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        getRowId,
        state: {
            sorting,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: { pageSize },
        },
    });

    return {
        table,
        globalFilter,
        setGlobalFilter,
    };
}
