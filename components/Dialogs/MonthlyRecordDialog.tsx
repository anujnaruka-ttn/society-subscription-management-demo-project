'use client'

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DialogProps } from "@/types/dialogProps"
import { MonthlyRecords } from "@/types/MonthlyRecords"
import { updateBillingStatus, getAllBillingRecords } from "@/lib/billingApis"

const STATUS_OPTIONS = {
    pending: { label: "Pending", variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-600", activeBg: "bg-yellow-100" },
    paid: { label: "Paid", variant: "default" as const, icon: CheckCircle2, color: "text-green-600", activeBg: "bg-green-100" },
    overdue: { label: "Overdue", variant: "destructive" as const, icon: AlertCircle, color: "text-red-600", activeBg: "bg-red-100" },
    cancelled: { label: "Cancelled", variant: "outline" as const, icon: AlertCircle, color: "text-gray-600", activeBg: "bg-gray-100" }
};

export default function MonthlyRecordDialog(
    { children, dialogProps, record }: { children: React.ReactNode, dialogProps: DialogProps, record: MonthlyRecords }
) {
    const [open, setOpen] = useState(false);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const statusConfig = STATUS_OPTIONS[record.status] || STATUS_OPTIONS.pending;
    const StatusIcon = statusConfig.icon;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{dialogProps.title}</DialogTitle>
                    <DialogDescription>{dialogProps.description}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4 text-sm">
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Owner</Label>
                        <p className="font-medium">{record.user_name}</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className="text-xs text-muted-foreground truncate cursor-help max-w-[150px]">{record.user_email}</p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{record.user_email}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Flat</Label>
                        <p className="font-medium">{record.flat_number} ({record.flat_type})</p>
                        <p className="text-xs text-muted-foreground">Floor {record.floor_number}</p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Billing Period</Label>
                        <p className="font-medium">{monthNames[record.billing_month - 1]} {record.billing_year}</p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Amount Due</Label>
                        <p className="font-medium text-primary">₹{record.amount_due}</p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Due Date</Label>
                        <p className="font-medium">{new Date(record.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="pt-1">
                            <Badge variant={statusConfig.variant} className="flex items-center gap-1.5 w-fit">
                                <StatusIcon className={cn("w-3.5 h-3.5", statusConfig.color)} />
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="hover:text-white">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
