"use client";

import { useState } from "react";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ReportType } from "@/types/reports";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: "includesString",
        state: {
            sorting,
            rowSelection,
        }
    });

    // const pageCount = table.getPageCount();
    // const currentPage = table.getState().pagination.pageIndex + 1;

    return (
        <Card className="w-full h-full overflow-hidden shadow-none space-y-1.5 border-none rounded-none gap-1.5 bg-transparent pt-0 pb-1.5 px-3">
            <div className="max-h-full w-full overflow-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
