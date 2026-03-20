"use client";

import React from "react";
import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

interface CommonTableProps<TData> {
    /** The TanStack table instance */
    table: TanstackTable<TData>;
    /** Optional loading state */
    loading?: boolean;
    /** Number of columns for the 'No results' row span */
    columnsCount: number;
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /** Current search filter value */
    globalFilter?: string;
    /** Function to set the search filter value */
    setGlobalFilter?: (value: string) => void;
    /** Optional action button (e.g., "Add New") */
    actionButton?: React.ReactNode;
    /** Optional extra filters or elements for the top bar */
    topExtra?: React.ReactNode;
    /** Additional class names for the container card */
    className?: string;
    /** Custom height for the table container */
    tableContainerClassName?: string;
}

/**
 * A reusable table component that handles pagination, searching, and sorting UI.
 * This component is designed to reduce boilerplate across different admin tables.
 */
export function CommonTable<TData>({
    table,
    loading,
    columnsCount,
    searchPlaceholder = "Search...",
    globalFilter,
    setGlobalFilter,
    actionButton,
    topExtra,
    className,
    tableContainerClassName,
}: CommonTableProps<TData>) {
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    return (
        <Card className={cn(
            "w-full h-full overflow-hidden shadow-none space-y-4 border-none rounded-none gap-1.5 bg-transparent",
            className
        )}>
            {/* Top Bar: Search, Page Size, and Actions */}
            <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-3 border-b">
                <div className="flex items-center gap-2 md:w-[70%] w-full">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-18">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">entries</span>
                </div>

                {/* Extra Filters (like Month Picker) */}
                {topExtra}

                {/* Search Input */}
                {setGlobalFilter !== undefined && (
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-8 md:w-full w-64 md:flex-1"
                    />
                )}

                {/* Action Button (like Add Flat) */}
                {actionButton}
            </div>

            {/* Table Area */}
            <div className={cn("h-[70%] w-full overflow-auto", tableContainerClassName)}>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center gap-2">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {/* Sorting Icons */}
                                                {header.column.getCanSort() && (
                                                    <div className="w-4">
                                                        {{
                                                            asc: <ChevronUp className="h-4 w-4" />,
                                                            desc: <ChevronDown className="h-4 w-4" />,
                                                        }[header.column.getIsSorted() as string] ?? (
                                                                <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                                                            )}
                                                    </div>
                                                )}
                                            </div>
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
                                    colSpan={columnsCount}
                                    className="h-24 text-center"
                                >
                                    {loading ? "Loading..." : "No results."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer: Pagination Info and Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-pretty text-sm text-muted-foreground">
                    Showing{" "}
                    {table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        1}{" "}
                    to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} entries
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.setPageIndex(page - 1)}
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
