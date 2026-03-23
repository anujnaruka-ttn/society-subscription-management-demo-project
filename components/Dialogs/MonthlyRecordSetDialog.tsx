"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { RootState, AppDispatch } from "@/stores/store";
import { verifyPaymentForBill, updateBillingStatus } from "@/lib/billingApis";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MonthlyRecords } from "@/types/MonthlyRecords";
import { FadeLoader } from "react-spinners";

const PaymentSetDialog = dynamic(() => import("./PaymentSetDialog"), {
    loading: () => <Button variant={"ghost"} className="w-3 h-3"></Button>
});

interface MonthlyRecordSetDialogProps {
    record: MonthlyRecords;
    children: React.ReactNode;
}

export default function MonthlyRecordSetDialog({ record, children }: MonthlyRecordSetDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.auth?.token);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openPaymentRecordDialog, setOpenPaymentRecordDialog] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<{
        verified: boolean;
        exists: boolean | null;
        payment: any | null;
    }>({
        verified: false,
        exists: null,
        payment: null
    });

    const handleVerify = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const result = await verifyPaymentForBill(record.id, token);
            if (result.success) {
                setVerificationStatus({
                    verified: true,
                    exists: result.data.exists,
                    payment: result.data.payment
                });
                if (!result.data.exists) {
                    setTimeout(() => setOpenPaymentRecordDialog(true), 2500);
                }
            }
        } catch (error) {
            toast.error("Failed to verify payment record");
        } finally {
            setTimeout(() => setLoading(false), 2499);
        }
    };

    useEffect(() => {
        if (open) {
            handleVerify();
        } else {
            // Reset status when closing
            setVerificationStatus({
                verified: false,
                exists: null,
                payment: null
            });
            setOpenPaymentRecordDialog(false);
        }
    }, [open, openPaymentRecordDialog]);

    const handleConfirmPaid = async () => {
        try {
            await dispatch(updateBillingStatus(record.id, "paid"));
            setOpen(false);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Verify Payment Status</DialogTitle>
                    <DialogDescription>
                        Validating payment for {record.user_name}'s flat ({record.flat_number})
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Checking...</p>
                        </div>
                    ) : verificationStatus.verified ? (
                        verificationStatus.exists ? (
                            <div className="text-center space-y-3">
                                <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-green-600">Payment Record Found!</p>
                                    <p className="text-sm text-muted-foreground">
                                        Amount: ₹{verificationStatus.payment?.amount_paid} via {verificationStatus.payment?.payment_mode}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-3">
                                <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full w-fit">
                                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-yellow-600">No Payment Found</p>
                                    <p className="text-sm text-muted-foreground px-4">
                                        Please record the payment to continue
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <p className="text-sm text-muted-foreground">Initializing verification...</p>
                    )}
                </div>

                <DialogFooter>
                    {!loading && verificationStatus.verified && verificationStatus.exists && (
                        <Button className="w-fit" onClick={handleConfirmPaid}>
                            Mark as Paid
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => setOpen(false)} className="w-fit hover:text-white">
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>

            <PaymentSetDialog
                open={openPaymentRecordDialog}
                onOpenChange={setOpenPaymentRecordDialog}
                record={{
                    bill_id: record.id,
                    amount_due: record.amount_due,
                    bill_status: record.status,
                    billing_month: record.billing_month,
                    billing_year: record.billing_year,
                    flat_id: record.flat_id,
                    flat_number: record.flat_number,
                    floor_number: record.floor_number,
                    flat_type: record.flat_type,
                    user_id: record.user_id,
                    user_name: record.user_name,
                    user_email: record.user_email,
                    user_phone: record.user_phone,
                    flat_address: record.flat_address,
                    payment_id: null,
                    payment_mode: null,
                    amount_paid: null,
                    payment_date: null,
                    payment_status: null,
                    transaction_id: null,
                    residents: null
                }}
            />
        </Dialog>
    );
}
