import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import CommonBadge from "@/components/common/CommonBadge";
import { ResidentBillingRecord } from "@/types/ResidentBillingRecord";
import { CheckCircle2, AlertCircle, XCircle, ExternalLink, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const statusConfig = {
    pending: { variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-600", label: "Pending" },
    paid: { variant: "default" as const, icon: CheckCircle2, color: "text-green-600", label: "Paid" },
    overdue: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600", label: "Overdue" },
    cancelled: { variant: "outline" as const, icon: XCircle, color: "text-gray-500", label: "Cancelled" },
};

export const getResidentSubscriptionsColumns = (): ColumnDef<ResidentBillingRecord>[] => [
    {
        accessorKey: "billing_month",
        header: "Month",
        cell: ({ row }) => {
            const month = row.getValue("billing_month") as number;
            const year = row.original.billing_year;
            return (
                <div className="font-medium">
                    {MONTH_NAMES[month - 1]} {year}
                </div>
            );
        },
    },
    {
        accessorKey: "flat_address",
        header: "Flat Address",
    },
    {
        accessorKey: "flat_type",
        header: "Type",
        cell: ({ row }) => <span className="capitalize">{row.original.flat_type || "N/A"}</span>,
    },
    {
        id: "residents",
        header: "Residents",
        cell: ({ row }) => <CommonBadge items={row.original.residents} />
    },
    {
        accessorKey: "amount_due",
        header: "Amount Due",
        cell: ({ row }) => {
            const amount = row.getValue("amount_due") as number;
            return <div className="font-semibold">₹{Number(amount).toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const config = statusConfig[status as keyof typeof statusConfig];
            if (!config) return <span>{status}</span>;
            const Icon = config.icon;
            return (
                <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                    <Icon className={cn("w-3 h-3", config.color)} />
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "payment_mode",
        header: "Payment Mode",
        cell: ({ row }) => {
            const mode = row.original.payment_mode;
            if (!mode) return <span className="text-muted-foreground text-sm">—</span>;
            const modeLabels: Record<string, string> = {
                cash: "Cash",
                offline: "Offline",
                upi: "UPI",
                online_razorpay: "Razorpay",
                online_stripe: "Stripe",
            };
            return <span className="text-sm capitalize">{modeLabels[mode] ?? mode}</span>;
        },
    },
    {
        accessorKey: "amount_paid",
        header: "Amount Paid",
        cell: ({ row }) => {
            const paid = row.original.amount_paid;
            return paid != null
                ? <div className="font-medium text-green-600">₹{Number(paid).toLocaleString()}</div>
                : <span className="text-muted-foreground text-sm">—</span>;
        },
    },
    {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) => {
            const date = row.getValue("due_date") as string | null;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const month = row.original.billing_month;
            const year = row.original.billing_year;
            const status = row.original.status;

            return (
                <div className="flex items-center gap-2">
                    {(status === "pending" || status === "overdue") && (
                        <Link href={`/pay-now?flatId=${row.original.flat_id}`}>
                            <Button size="sm" className="h-7 gap-1 text-xs">
                                Pay Now
                            </Button>
                        </Link>
                    )}
                    
                    <Link href={`/subscriptions/${year}-${String(month).padStart(2, "0")}`}>
                        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                            <ExternalLink className="size-3" />
                            View
                        </Button>
                    </Link>
                </div>
            );
        },
    },
];
