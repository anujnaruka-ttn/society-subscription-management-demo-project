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
    CreditCard,
    Plus,
    HelpCircle,
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
import { PaymentEntryData } from "@/types/PaymentEntryData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

const columns: ColumnDef<PaymentEntryData>[] = [
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
        accessorKey: "resident",
        header: "Resident",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-nowrap">{row.getValue("resident")}</span>
                <span className="text-xs text-muted-foreground">{(row.original as any).email}</span>
            </div>
        ),
    },
    {
        accessorKey: "flatAddress",
        header: "Flat Address",
    },
    {
        id: "payment-record",
        header: "Payment Record",
        cell: ({ row }) => {
            const paymentRecord = row.original.paymentRecord;
            return (
                <div className="flex items-center gap-2">
                    {paymentRecord ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                            {paymentRecord === "cash" ? <CreditCard className="size-3" /> : <Plus className="size-3" />}
                            {paymentRecord}
                        </div>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-muted-foreground/50">
                                    <HelpCircle className="size-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>No payment record found</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            );
        },
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
                            className="h-8 w-8"
                            aria-label="Quick Pay"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Payment Record</TooltipContent>
                </Tooltip>
            </div>
        ),
    }
];

const data: PaymentEntryData[] = [
    {
        id: "1",
        resident: "Anuj Naruka",
        flatAddress: "Tower A, 101",
        status: "pending",
        paymentRecord: "cash",
    },
    {
        id: "2",
        resident: "John Doe",
        flatAddress: "Tower B, 202",
        status: "pending",
        paymentRecord: "upi",
    },
    {
        id: "3",
        resident: "Alice Smith",
        flatAddress: "Tower C, 303",
        status: "pending",
    },
    {
        id: "4",
        resident: "Bob Johnson",
        flatAddress: "Tower D, 404",
        status: "pending",
        paymentRecord: "cash",
    },
    {
        id: "5",
        resident: "Emma Wilson",
        flatAddress: "Tower A, 505",
        status: "pending",
    },
    {
        id: "6",
        resident: "Michael Brown",
        flatAddress: "Tower B, 606",
        status: "pending",
        paymentRecord: "upi",
    },
    {
        id: "7",
        resident: "Sarah Davis",
        flatAddress: "Tower C, 707",
        status: "pending",
    },
    {
        id: "8",
        resident: "David Clark",
        flatAddress: "Tower D, 808",
        status: "pending",
        paymentRecord: "cash",
    },
    {
        id: "9",
        resident: "James Miller",
        flatAddress: "Tower A, 909",
        status: "pending",
    },
    {
        id: "10",
        resident: "Linda White",
        flatAddress: "Tower B, 1010",
        status: "pending",
        paymentRecord: "upi",
    },
];


export default function PaymentEntryTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
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

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    return (
        <Card className="w-[98%] mx-auto max-h-full overflow-hidden space-y-1.5 
        border-none shadow-none rounded-none bg-transparent gap-1.5 pt-0 pb-1.5 px-1.5">

            <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1.5 border-b">
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
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 md:w-full w-64 md:flex-1"
                />
            </div>
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
