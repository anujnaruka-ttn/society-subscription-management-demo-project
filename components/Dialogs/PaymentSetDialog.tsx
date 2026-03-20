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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GiWallet } from "react-icons/gi";
import { FaCashRegister } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { PaymentEntryData } from "@/types/PaymentEntry";
import { toast } from "sonner";

interface PaymentSetDialogProps {
    record: PaymentEntryData;
    children: React.ReactNode;
}

export default function PaymentSetDialog({ record, children }: PaymentSetDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [paymentMode, setPaymentMode] = useState("cash");

    const handleRecordPayment = async () => {
        setLoading(true);
        try {
            const success = await dispatch(recordPayment({
                bill_id: record.bill_id,
                user_id: record.owner_id,
                amount_paid: record.amount_due,
                payment_mode: paymentMode,
                transaction_id: transactionId
            }) as any);

            if (success) {
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
                    <Tabs defaultValue="cash" onValueChange={setPaymentMode} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-1 bg-muted/50">
                            <TabsTrigger value="cash" className="flex flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <GiWallet className="size-5 text-green-600" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Cash</span>
                            </TabsTrigger>
                            <TabsTrigger value="offline" className="flex flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <FaCashRegister className="size-5 text-orange-600" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Offline</span>
                            </TabsTrigger>
                            <TabsTrigger value="upi" className="flex flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Image src="/assets/upi-logo.png" alt="UPI" width={32} height={12} className="h-4 object-contain" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">UPI</span>
                            </TabsTrigger>
                            <TabsTrigger value="online" className="flex flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Image src="/assets/online-razorpay-logo.png" alt="Online" width={32} height={12} className="h-4 object-contain" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Razorpay</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/10 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Amount Due:</span>
                                <span className="font-bold text-lg">₹{record.amount_due.toLocaleString('en-IN')}</span>
                            </div>

                            <TabsContent value="cash" className="mt-0">
                                <p className="text-xs text-muted-foreground text-center bg-green-50 text-green-700 py-2 rounded-md border border-green-100">
                                    Direct cash collection from resident. No transaction ID required.
                                </p>
                            </TabsContent>

                            <TabsContent value="offline" className="mt-0 space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ref-off" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference/Receipt No.</Label>
                                    <Input
                                        id="ref-off"
                                        placeholder="Enter manual receipt number"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="upi" className="mt-0 space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ref-upi" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">UPI Transaction ID</Label>
                                    <Input
                                        id="ref-upi"
                                        placeholder="UTR / Ref Number"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="online" className="mt-0 space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ref-rzp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Online Payment ID</Label>
                                    <Input
                                        id="ref-rzp"
                                        placeholder="pay_..."
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
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
