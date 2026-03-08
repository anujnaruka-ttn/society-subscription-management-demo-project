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
import { PendingPaymentData } from "@/types/PendingPayment";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const columns: ColumnDef<PendingPaymentData>[] = [
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
            <span className="font-medium text-nowrap">{row.getValue("resident")}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "flatAddress",
        header: "Flat Address",
    },
    {
        id: "status",
        header: "Status",
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
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <div>{row.getValue("status")}</div>
            </div>
        ),
    },
];

const data: PendingPaymentData[] = [
    {
        id: "1",
        resident: "Anuj Naruka",
        email: "anuj@example.com",
        phone: "+91 9876543210",
        flatAddress: "Tower A, 101",
        status: "pending",
    },
    {
        id: "2",
        resident: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543211",
        flatAddress: "Tower B, 202",
        status: "pending",
    },
    {
        id: "3",
        resident: "Alice Smith",
        email: "alice@example.com",
        phone: "+91 9876543212",
        flatAddress: "Tower C, 303",
        status: "pending",
    },
    {
        id: "4",
        resident: "Bob Johnson",
        email: "bob@example.com",
        phone: "+91 9876543213",
        flatAddress: "Tower D, 404",
        status: "pending",
    },
    {
        id: "5",
        resident: "Emma Wilson",
        email: "emma@example.com",
        phone: "+91 9876543214",
        flatAddress: "Tower A, 505",
        status: "pending",
    },
    {
        id: "6",
        resident: "Michael Brown",
        email: "michael@example.com",
        phone: "+91 9876543215",
        flatAddress: "Tower B, 606",
        status: "pending",
    },
    {
        id: "7",
        resident: "Sarah Davis",
        email: "sarah@example.com",
        phone: "+91 9876543216",
        flatAddress: "Tower C, 707",
        status: "pending",
    },
    {
        id: "8",
        resident: "David Clark",
        email: "david@example.com",
        phone: "+91 9876543217",
        flatAddress: "Tower D, 808",
        status: "pending",
    },
    {
        id: "9",
        resident: "James Miller",
        email: "james@example.com",
        phone: "+91 9876543218",
        flatAddress: "Tower A, 909",
        status: "pending",
    },
    {
        id: "10",
        resident: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
        status: "pending",
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
        <Card className="w-full max-h-full overflow-hidden shadow-none space-y-1.5 border-none rounded-none gap-1.5 bg-transparent pt-0 pb-1.5 px-3">
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
