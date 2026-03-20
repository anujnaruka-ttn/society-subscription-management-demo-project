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
import {
    Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ReportType } from "@/types/reports";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CommonTable } from "../Common/CommonTable";

const columns: ColumnDef<ReportType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "reportDate",
        header: "Report Date",
        cell: ({ row }) => (
            <span className="font-medium text-nowrap">{row.getValue("reportDate")}</span>
        ),
    },
    {
        accessorKey: "reportType",
        header: "Format",
        cell: ({ row }) => (
            <span className="uppercase text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {row.getValue("reportType")}
            </span>
        ),
    },
    {
        accessorKey: "reportPeriod",
        header: "Period",
        cell: ({ row }) => (
            <span className="capitalize">{row.getValue("reportPeriod")}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            aria-label="Delete"
                        >
                            <Trash2Icon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Report</TooltipContent>
                </Tooltip>
            </div>
        ),
    },
];

const data: ReportType[] = [
    {
        id: "1",
        reportType: "pdf",
        reportDate: "Mar 01, 2026",
        reportPeriod: "monthly"
    },
    {
        id: "2",
        reportType: "csv",
        reportDate: "Feb 02, 2026",
        reportPeriod: "monthly"
    },
    {
        id: "3",
        reportType: "pdf",
        reportDate: "Jan 10, 2026",
        reportPeriod: "yearly"
    },
    {
        id: "4",
        reportType: "pdf",
        reportDate: "Jan 05, 2026",
        reportPeriod: "yearly"
    },
    {
        id: "5",
        reportType: "csv",
        reportDate: "Dec 15, 2025",
        reportPeriod: "monthly"
    },
    {
        id: "6",
        reportType: "pdf",
        reportDate: "Nov 20, 2025",
        reportPeriod: "monthly"
    },
    {
        id: "7",
        reportType: "pdf",
        reportDate: "Oct 10, 2025",
        reportPeriod: "monthly"
    },
    {
        id: "8",
        reportType: "csv",
        reportDate: "Sep 05, 2025",
        reportPeriod: "monthly"
    },
];

export default function ReportsHistoryTable() {
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
            columnsCount={columns.length}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            className="pt-0 pb-1.5 px-3" // Specific padding for integration in Reports page
        />
    );
}
