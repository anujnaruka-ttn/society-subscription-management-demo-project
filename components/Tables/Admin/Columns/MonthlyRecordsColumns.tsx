import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, AlertCircle, Wallet, Ban, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MonthlyRecords } from "@/types/MonthlyRecords";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MonthlyRecordDialog = dynamic(() => import("@/components/Dialogs/MonthlyRecordDialog"), {
    ssr: false,
    loading: () => <Button variant={"ghost"} className="w-3 h-3"></Button>
});

const MonthlyRecordSetDialog = dynamic(() => import("@/components/Dialogs/MonthlyRecordSetDialog"), {
    ssr: false,
    loading: () => <Button variant={"ghost"} className="w-3 h-3"></Button>
});

export const getMonthlyRecordsColumns = (
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
                    <div className="text-sm text-muted-foreground">{row.original.owner_email || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{row.original.owner_phone || "-"}</div>
                </div>
            ),
        },
        {
            accessorKey: "flat_address",
            header: "Flat Address",
            cell: ({ row }) => (
                <div className="space-y-1">
                    <div className="font-medium">{row.getValue("flat_address")}</div>
                    <div className="text-sm text-muted-foreground">Type: {row.original.flat_type}</div>
                </div>
            ),
        },
        {
            accessorKey: "billing_month",
            header: "Billing Period",
            cell: ({ row }) => {
                const month = row.getValue("billing_month") as number;
                const year = row.original.billing_year;
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
                    cancelled: { variant: "outline" as const, icon: XCircle, color: "text-gray-600" }
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
            cell: ({ row }) => {
                const isPaid = row.original.status === 'paid';
                const isCancelled = row.original.status === 'cancelled';

                return (
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MonthlyRecordDialog
                                    dialogProps={{ title: "Billing Record Details", description: "Detailed view of the billing record" }}
                                    record={row.original}
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-muted"
                                        aria-label="View details"
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                </MonthlyRecordDialog>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        {isPaid ? (
                            <div className="flex items-center justify-center h-8 w-8">
                                <CheckCircle2 className="size-5 text-green-600" />
                            </div>
                        ) : !isCancelled && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <MonthlyRecordSetDialog record={row.original}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                            aria-label="Mark as paid"
                                        >
                                            <Wallet className="size-4" />
                                        </Button>
                                    </MonthlyRecordSetDialog>
                                </TooltipTrigger>
                                <TooltipContent>Mark as Paid</TooltipContent>
                            </Tooltip>
                        )}

                        {!isCancelled && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        aria-label="Cancel record"
                                        onClick={() => onDelete?.(row.original.id)}
                                    >
                                        <Ban className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Cancel Record (Soft Delete)</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];
