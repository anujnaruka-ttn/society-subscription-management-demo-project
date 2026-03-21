"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { recordPayment } from "@/lib/paymentApis";
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
import { Loader2 } from "lucide-react";
import { PaymentEntryData } from "@/types/PaymentEntry";
import { toast } from "sonner";
import PaymentModeTabs from "@/components/Dashboard/Admin/PaymentModeTabs";

interface PaymentSetDialogProps {
    record: PaymentEntryData;
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function PaymentSetDialog({ record, children, open: externalOpen, onOpenChange: setExternalOpen }: PaymentSetDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [internalOpen, setInternalOpen] = useState(false);

    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [paymentMode, setPaymentMode] = useState("cash");

    const handleRecordPayment = async () => {
        setLoading(true);
        try {
            const result = await dispatch(recordPayment({
                bill_id: record.bill_id,
                user_id: record.owner_id,
                amount_paid: record.amount_due,
                payment_mode: paymentMode,
                transaction_id: transactionId
            }) as any);

            if (result) {
                setOpen(false);
                setTransactionId("");
            }
        } catch (error) {
            toast.error("Failed to record payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                        Select payment mode for {record.owner_name} - Flat {record.flat_number}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <PaymentModeTabs
                        amountDue={record.amount_due}
                        paymentMode={paymentMode}
                        setPaymentMode={setPaymentMode}
                        transactionId={transactionId}
                        setTransactionId={setTransactionId}
                    />
                </div>

                <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleRecordPayment} disabled={loading} className="min-w-[120px]">
                        {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Record Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
