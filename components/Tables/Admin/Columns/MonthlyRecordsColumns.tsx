import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2Icon, Eye, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MonthlyRecords } from "@/types/MonthlyRecords";
import { cn } from "@/lib/utils";

export const getMonthlyRecordsColumns = (
    onView?: (record: MonthlyRecords) => void,
    onUpdateStatus?: (id: string, status: string) => void,
    onDelete?: (id: string) => void
): ColumnDef<MonthlyRecords>[] => [
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
        accessorKey: "owner_name",
        header: "Owner",
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium">{row.getValue("owner_name") || "N/A"}</div>
                <div className="text-sm text-muted-foreground">{row.getValue("owner_email") || "N/A"}</div>
                <div className="text-sm text-muted-foreground">{row.getValue("owner_phone") || "-"}</div>
            </div>
        ),
    },
    {
        accessorKey: "flat_address",
        header: "Flat Address",
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium">{row.getValue("flat_address")}</div>
                <div className="text-sm text-muted-foreground">Type: {row.getValue("flat_type")}</div>
            </div>
        ),
    },
    {
        accessorKey: "billing_month",
        header: "Billing Period",
        cell: ({ row }) => {
            const month = row.getValue("billing_month") as number;
            const year = row.getValue("billing_year") as number;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return (
                <div className="font-medium">
                    {monthNames[month - 1]} {year}
                </div>
            );
        },
    },
    {
        accessorKey: "amount_due",
        header: "Amount Due",
        cell: ({ row }) => {
            const amount = row.getValue("amount_due") as number;
            return (
                <div className="font-medium">
                    ₹{amount.toLocaleString()}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusConfig = {
                pending: { variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-600" },
                paid: { variant: "default" as const, icon: CheckCircle2, color: "text-green-600" },
                overdue: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600" },
                cancelled: { variant: "outline" as const, icon: AlertCircle, color: "text-gray-600" }
            };
            
            const config = statusConfig[status as keyof typeof statusConfig];
            const Icon = config.icon;
            
            return (
                <Badge variant={config.variant} className="flex items-center gap-1">
                    <Icon className={cn("w-3 h-3", config.color)} />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) => {
            const dueDate = row.getValue("due_date") as string;
            return dueDate ? new Date(dueDate).toLocaleDateString() : "-";
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
                            aria-label="View details"
                            onClick={() => onView?.(row.original)}
                        >
                            <Eye className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Details</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Update status"
                            onClick={() => onUpdateStatus?.(row.original.id, row.original.status === 'paid' ? 'pending' : 'paid')}
                        >
                            <CreditCard className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle Payment Status</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            aria-label="Delete"
                            onClick={() => onDelete?.(row.original.id)}
                        >
                            <Trash2Icon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
            </div>
        ),
    },
];
