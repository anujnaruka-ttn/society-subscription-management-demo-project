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
    CreditCard,
    CheckCircle2,
    AlertCircle,
    Eye
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
import { Card } from "@/components/ui/card";
import { MonthlyRecords } from "@/types/MonthlyRecords";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ConfigProvider, DatePicker, theme as antdtheme } from "antd";
import { useTheme } from "next-themes";

const columns: ColumnDef<MonthlyRecords>[] = [
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
        accessorKey: "paymentStatus",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;
            return (
                <Badge
                    variant={status === "paid" ? "outline" : "destructive"}
                    className={cn(
                        "capitalize gap-1 px-2 py-0.5",
                        status === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""
                    )}
                >
                    {status === "paid" ? (
                        <CheckCircle2 className="size-3" />
                    ) : (
                        <AlertCircle className="size-3" />
                    )}
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const status = row.original.paymentStatus;
            return (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Eye className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                    </Tooltip>

                    {status === "due" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/10"
                                >
                                    <CreditCard className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Pay Now</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            );
        },
    }
];

const data: MonthlyRecords[] = [
    {
        id: "1",
        resident: "Anuj Naruka",
        email: "anuj@example.com",
        phone: "+91 9876543210",
        flatAddress: "Tower A, 101",
        paymentStatus: "paid",
    },
    {
        id: "2",
        resident: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543211",
        flatAddress: "Tower B, 202",
        paymentStatus: "due",
    },
    {
        id: "3",
        resident: "Alice Smith",
        email: "alice@example.com",
        phone: "+91 9876543212",
        flatAddress: "Tower C, 303",
        paymentStatus: "paid",
    },
    {
        id: "4",
        resident: "Bob Johnson",
        email: "bob@example.com",
        phone: "+91 9876543213",
        flatAddress: "Tower D, 404",
        paymentStatus: "due",
    },
    {
        id: "5",
        resident: "Emma Wilson",
        email: "emma@example.com",
        phone: "+91 9876543214",
        flatAddress: "Tower A, 505",
        paymentStatus: "paid",
    },
    {
        id: "6",
        resident: "Michael Brown",
        email: "michael@example.com",
        phone: "+91 9876543215",
        flatAddress: "Tower B, 606",
        paymentStatus: "due",
    },
    {
        id: "7",
        resident: "Sarah Davis",
        email: "sarah@example.com",
        phone: "+91 9876543216",
        flatAddress: "Tower C, 707",
        paymentStatus: "paid",
    },
    {
        id: "8",
        resident: "David Clark",
        email: "david@example.com",
        phone: "+91 9876543217",
        flatAddress: "Tower D, 808",
        paymentStatus: "due",
    },
    {
        id: "9",
        resident: "James Miller",
        email: "james@example.com",
        phone: "+91 9876543218",
        flatAddress: "Tower A, 909",
        paymentStatus: "paid",
    },
    {
        id: "10",
        resident: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flatAddress: "Tower B, 1010",
        paymentStatus: "due",
    },
    {
        id: "11",
        resident: "Robert Taylor",
        email: "robert@example.com",
        phone: "+91 9876543220",
        flatAddress: "Tower C, 1101",
        paymentStatus: "paid",
    },
    {
        id: "12",
        resident: "Patricia Moore",
        email: "patricia@example.com",
        phone: "+91 9876543221",
        flatAddress: "Tower D, 1202",
        paymentStatus: "due",
    }
];


export default function MonthlyRecordsTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const { theme: nextTheme } = useTheme();

    const { defaultAlgorithm, darkAlgorithm } = antdtheme;


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
    const pathname = usePathname();

    return (
        <Card className="w-full max-h-[calc(100vh-64px)] overflow-hidden shadow-none space-y-4 border-none rounded-none gap-1.5 bg-transparent p-6">
            {
                pathname !== "/admin/dashboard" &&
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
                            onChange={(value) => table.setGlobalFilter(value)}
                            className="h-8 md:w-full w-64 md:flex-1"
                        />

                    </ConfigProvider>

                </div>
            }
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

            {
                pathname !== "/admin/dashboard" &&
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
            }
        </Card>
    );
}
