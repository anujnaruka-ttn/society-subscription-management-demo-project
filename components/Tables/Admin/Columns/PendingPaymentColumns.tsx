"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PendingPaymentData } from "@/types/PendingPayment";

export const pendingPaymentColumns: ColumnDef<PendingPaymentData>[] = [
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
            <span className="font-medium text-nowrap text-xs">{row.getValue("resident")}</span>
        ),
    },
    {
        accessorKey: "flatAddress",
        header: "Flat",
        cell: ({ row }) => (
            <span className="text-xs">{row.getValue("flatAddress")}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-[10px] h-5 bg-orange-50 text-orange-600 border-orange-100 uppercase font-bold">
                {row.getValue("status")}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => console.log("Notify user:", row.original.id)}
                    >
                        <AlertCircle className="size-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Notify</TooltipContent>
            </Tooltip>
        ),
    },
];
