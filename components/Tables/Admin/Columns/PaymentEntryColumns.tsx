import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Layout, Plus } from "lucide-react";
import { GiWallet } from "react-icons/gi";
import { FaCashRegister } from "react-icons/fa6";
import Image from "next/image";
import { PaymentEntryData } from "@/types/PaymentEntry";
import CommonBadge from "@/components/common/CommonBadge";
import { ResidentData } from "@/types/flatData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const PaymentSetDialog = dynamic(() => import("@/components/Dialogs/PaymentSetDialog"), {
    ssr: false,
    loading: () => <Button variant="outline" size="icon" className="h-8 w-8"><Plus className="size-4" /></Button>
});

export const paymentEntryColumns: ColumnDef<PaymentEntryData>[] = [
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
        accessorKey: "residents",
        header: "Residents",
        cell: ({ row }) => {
            const residents = row.original.residents || [];
            if (residents.length === 0) return <span className="text-muted-foreground italic">No residents</span>;

            const shouldTruncate = residents.length > 4;
            const displayResidents = shouldTruncate ? residents.slice(0, 3) : residents;
            const remainingCount = residents.length - displayResidents.length;

            return (
                <div className="flex items-center gap-1.5 flex-wrap">
                    <CommonBadge
                        items={displayResidents as ResidentData[]}
                        variant="secondary"
                    />
                    {remainingCount > 0 && (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-dashed text-[10px] h-5">
                            +{remainingCount} more
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "owner_name",
        header: "Owner",
        cell: ({ row }) => (
            <div className="space-y-0.5">
                <div className="font-medium text-sm">{row.original.owner_name || "N/A"}</div>
                <div className="text-[11px] text-muted-foreground leading-none">{row.original.owner_email}</div>
            </div>
        ),
    },
    {
        accessorKey: "flat_address",
        header: "Flat Address",
        cell: ({ row }) => (
            <div className="space-y-0.5">
                <div className="font-medium text-sm">{row.original.flat_address}</div>
                <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 h-4 font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                        {row.original.flat_type}
                    </Badge>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "payment_mode",
        header: "Payment Mode",
        cell: ({ row }) => {
            const mode = row.original.payment_mode;

            if (!mode) return <span className="text-xl font-bold text-muted-foreground/50 ml-6">?</span>;

            if (mode === 'cash') {
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center justify-center p-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 w-fit ml-6 hover:bg-green-100 transition-colors">
                                <GiWallet className="size-5" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Cash Payment</TooltipContent>
                    </Tooltip>
                );
            }

            if (mode === 'offline') {
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center justify-center p-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 w-fit ml-6 hover:bg-orange-100 transition-colors">
                                <FaCashRegister className="size-5" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Offline Payment</TooltipContent>
                    </Tooltip>
                );
            }

            if (mode === 'upi') {
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center justify-center p-1 rounded-md bg-white hover:bg-indigo-100/50 border border-indigo-100 transition-all w-fit ml-6 cursor-help">
                                <Image
                                    src="/assets/upi-logo.png"
                                    alt="UPI"
                                    width={40}
                                    height={16}
                                    className="h-4 object-contain"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>UPI Payment</TooltipContent>
                    </Tooltip>
                );
            }

            if (mode === 'online_razorpay' || mode === 'online_stripe' || mode === 'online') {
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center justify-center p-1 rounded-md bg-blue-100 hover:bg-indigo-100/50 border border-blue-100 transition-all w-fit ml-6 cursor-help">
                                <Image
                                    src="/assets/online-razorpay-logo.png"
                                    alt="Online"
                                    width={48}
                                    height={16}
                                    className="h-4 object-contain transition-all"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Online Payment (Razorpay/Stripe)</TooltipContent>
                    </Tooltip>
                );
            }

            return <Badge variant="outline">{mode}</Badge>;
        },
    },
    {
        accessorKey: "bill_status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.bill_status;
            const isPaid = status === 'paid';
            return (
                <Badge variant={isPaid ? "default" : "secondary"} className={isPaid ? "bg-green-600 hover:bg-green-700" : ""}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount_due",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-bold text-sm">
                ₹{(row.original.amount_paid || row.original.amount_due).toLocaleString('en-IN')}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const isPaid = row.original.bill_status === 'paid';
            
            if (isPaid) return null;

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <PaymentSetDialog record={row.original}>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 text-primary hover:bg-primary/10 border-primary/20"
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </PaymentSetDialog>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Record Manual Payment</TooltipContent>
                </Tooltip>
            );
        }
    }
];
