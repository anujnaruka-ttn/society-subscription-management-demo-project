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
    FileTextIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card } from "../ui/card";
import { FlatData } from "@/types/flatData";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import DialogCommon from "./DialogCommon";

const columns: ColumnDef<FlatData>[] = [
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
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => (
            <span className="font-medium text-nowrap">{row.getValue("owner")}</span>
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
        id: "actions",
        header: "Actions",
        cell: () => (
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                            // onClick={() => handleAction(task, "delete")}
                            // disabled={busy}
                            aria-label="Delete"
                        >
                            <Trash2Icon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogCommon>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="View details"
                            >
                                <FileTextIcon className="size-4" />
                            </Button>
                        </DialogCommon>
                    </TooltipTrigger>
                    <TooltipContent>View Details</TooltipContent>
                </Tooltip>
            </div>
        ),
    },
];

const data: FlatData[] = [
    {
        id: "1",
        owner: "Anuj Naruka",
        email: "anuj@example.com",
        phone: "+91 9876543210",
        flatAddress: "Tower A, 101",
    },
    {
        id: "2",
        owner: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543211",
        flatAddress: "Tower B, 202",
    },
    {
        id: "3",
        owner: "Alice Smith",
        email: "alice@example.com",
        phone: "+91 9876543212",
        flatAddress: "Tower C, 303",
    },
    {
        id: "4",
        owner: "Bob Johnson",
        email: "bob@example.com",
        phone: "+91 9876543213",
        flatAddress: "Tower D, 404",
    },
    {
        id: "5",
        owner: "Emma Wilson",
        email: "emma@example.com",
        phone: "+91 9876543214",
        flatAddress: "Tower A, 505",
    },
    {
        id: "6",
        owner: "Michael Brown",
        email: "michael@example.com",
        phone: "+91 9876543215",
        flatAddress: "Tower B, 606",
    },
    {
        id: "7",
        owner: "Sarah Davis",
        email: "sarah@example.com",
        phone: "+91 9876543216",
        flatAddress: "Tower C, 707",

    },
    {
        id: "8",
        owner: "David Clark",
        email: "david@example.com",
        phone: "+91 9876543217",
        flatAddress: "Tower D, 808",

    },
    {
        id: "9",
        owner: "James Miller",
        email: "james@example.com",
        phone: "+91 9876543218",
        flatAddress: "Tower A, 909",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
    }
];


export default function DataTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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
        <Card className="w-full max-h-[75%] overflow-hidden shadow-none space-y-4 border-none rounded-none gap-1.5 bg-transparent p-6">
            <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-3 border-b">
                <div className="flex items-center gap-2">
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
                    className="h-8 w-full sm:w-64"
                />
            </div>

            <div className="max-h-full overflow-y-auto">
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
