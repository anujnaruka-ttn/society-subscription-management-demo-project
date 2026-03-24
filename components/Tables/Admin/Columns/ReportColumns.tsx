"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2Icon, Download } from "lucide-react";
import { ReportType } from "@/types/reports";
import { toast } from "sonner";

const handleDownload = async (report: ReportType) => {
    // Implement download logic here
    console.log('Download report:', report);
    toast.info('Download functionality coming soon');
};

const handleDelete = async (reportId: string) => {
    // Implement delete logic here
    console.log('Delete report:', reportId);
    toast.info('Delete functionality coming soon');
};

export const reportColumns: ColumnDef<ReportType>[] = [
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
        accessorKey: "generated_at",
        header: "Generated At",
        cell: ({ row }) => (
            <span className="font-medium text-nowrap">
                {new Date(row.getValue("generated_at")).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        ),
    },
    {
        accessorKey: "format",
        header: "Format",
        cell: ({ row }) => (
            <span className="uppercase text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {row.getValue("format")}
            </span>
        ),
    },
    {
        accessorKey: "range",
        header: "Period",
        cell: ({ row }) => (
            <span className="capitalize">{row.getValue("range")}</span>
        ),
    },
    {
        accessorKey: "month",
        header: "Month",
        cell: ({ row }) => (
            <span>{row.getValue("month") || 'All'}</span>
        ),
    },
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => (
            <span>{row.getValue("year")}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : status === 'failed' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "file_size",
        header: "Size",
        cell: ({ row }) => {
            const size = row.getValue("file_size") as number;
            const formattedSize = size > 1024 * 1024 
                ? `${(size / (1024 * 1024)).toFixed(1)} MB`
                : `${(size / 1024).toFixed(1)} KB`;
            return <span className="text-sm">{formattedSize}</span>;
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
                            aria-label="Download"
                            onClick={() => handleDownload(row.original)}
                        >
                            <Download className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download Report</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            aria-label="Delete"
                            onClick={() => handleDelete(row.original.id)}
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
