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
import { Card } from "@/components/ui/card";
import { FlatData } from "@/types/flatData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GoPlusCircle } from "react-icons/go";
import dynamic from "next/dynamic";

const FlatDetailDialog = dynamic(() => import("@/components/Dialogs/FlatDetailDialog"), {
    ssr: false,
    loading: () => <Button variant={"ghost"} className="w-3 h-3"></Button>
})


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
        accessorKey: "flat_number",
        header: "Flat Number",
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue("flat_number")}</span>
        ),
    },
    {
        accessorKey: "floor_number",
        header: "Floor",
        cell: ({ row }) => (
            <span className="font-medium">Floor {row.getValue("floor_number")}</span>
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
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <FlatDetailDialog dialogProps={{ title: "View Details", description: "View details of the flat" }}
                            flatDetails={row.original}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="View details"
                            >
                                <FileTextIcon className="size-4" />
                            </Button>
                        </FlatDetailDialog>
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
        flat_number: "101",
        floor_number: 1,
        flat_type: "2",
    },
    {
        id: "2",
        owner: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543211",
        flat_number: "202",
        floor_number: 2,
        flat_type: "3",
    },
    {
        id: "3",
        owner: "Alice Smith",
        email: "alice@example.com",
        phone: "+91 9876543212",
        flat_number: "303",
        floor_number: 3,
        flat_type: "1",
    },
    {
        id: "4",
        owner: "Bob Johnson",
        email: "bob@example.com",
        phone: "+91 9876543213",
        flat_number: "404",
        floor_number: 4,
        flat_type: "2",
    },
    {
        id: "5",
        owner: "Emma Wilson",
        email: "emma@example.com",
        phone: "+91 9876543214",
        flat_number: "505",
        floor_number: 5,
        flat_type: "3",
    },
    {
        id: "6",
        owner: "Michael Brown",
        email: "michael@example.com",
        phone: "+91 9876543215",
        flat_number: "606",
        floor_number: 6,
        flat_type: "4",
    },
    {
        id: "7",
        owner: "Sarah Davis",
        email: "sarah@example.com",
        phone: "+91 9876543216",
        flat_number: "707",
        floor_number: 7,
        flat_type: "2",
    },
    {
        id: "8",
        owner: "David Clark",
        email: "david@example.com",
        phone: "+91 9876543217",
        flat_number: "808",
        floor_number: 8,
        flat_type: "1",
    },
    {
        id: "9",
        owner: "James Miller",
        email: "james@example.com",
        phone: "+91 9876543218",
        flat_number: "909",
        floor_number: 9,
        flat_type: "3",
    },
    {
        id: "10",
        owner: "Linda White",
        email: "linda@example.com",
        phone: "+91 9876543219",
        flat_number: "1010",
        floor_number: 10,
        flat_type: "2",
    },
];


export default function FlatsTable() {
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
        <Card className="w-full max-h-[calc(100vh-64px)] overflow-hidden shadow-none space-y-4 border-none rounded-none gap-1.5 bg-transparent pt-1.5 pb-6 px-6">

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
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 md:w-full w-64 md:flex-1"
                />
                <FlatDetailDialog dialogProps={{ title: "Add Flat", description: "Add a new flat to the society" }} flatDetails={{ id: "", owner: "", email: "", phone: "", flat_number: "", floor_number: 0, flat_type: "" }}>
                    <Button
                        variant="outline"
                        size="icon-lg"
                        className="w-full md:w-fit px-3 ml-auto h-8 hover:text-white"
                    >
                        <GoPlusCircle />
                        Add Flat
                    </Button>
                </FlatDetailDialog>
            </div>

            <div className="max-h-[90%] w-full overflow-auto">
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
