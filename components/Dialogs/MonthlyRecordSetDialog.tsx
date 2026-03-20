"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
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
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { MonthlyRecords } from "@/types/MonthlyRecords";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MonthlyRecordSetDialogProps {
    record: MonthlyRecords;
    children: React.ReactNode;
}

export default function MonthlyRecordSetDialog({ record, children }: MonthlyRecordSetDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth?.token);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
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
            }
        } catch (error) {
            toast.error("Failed to verify payment record");
        } finally {
            setLoading(false);
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
        }
    }, [open]);

    const handleConfirmPaid = async () => {
        try {
            await dispatch(updateBillingStatus(record.id, "paid"));
            setOpen(false);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleRedirectToPayment = () => {
        const queryParams = new URLSearchParams({
            flatId: record.flat_id || "",
            month: record.billing_month.toString(),
            year: record.billing_year.toString(),
            from: "billing"
        });
        router.push(`/admin/payments?${queryParams.toString()}`);
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
                        Validating payment for {record.owner_name}'s flat ({record.flat_number})
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Checking database...</p>
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
                                        We couldn't find a successful transaction for this billing period.
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <p className="text-sm text-muted-foreground">Initializing verification...</p>
                    )}
                </div>

                <DialogFooter>
                    {!loading && verificationStatus.verified && (
                        verificationStatus.exists ? (
                            <Button className="w-fit" onClick={handleConfirmPaid}>
                                Mark as Paid
                            </Button>
                        ) : (
                            <Button className="w-fit group" onClick={handleRedirectToPayment}>
                                Go to Payment Entry
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        )
                    )}
                    <Button variant="outline" onClick={() => setOpen(false)} className="w-fit hover:text-white">
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
