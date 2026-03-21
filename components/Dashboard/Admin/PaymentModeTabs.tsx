"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GiWallet } from "react-icons/gi";
import { FaCashRegister } from "react-icons/fa6";
import Image from "next/image";

interface PaymentModeTabsProps {
    amountDue: number;
    paymentMode: string;
    setPaymentMode: (mode: string) => void;
    transactionId: string;
    setTransactionId: (id: string) => void;
}

const PAYMENT_MODES = [
    {
        value: "cash",
        label: "Cash",
        icon: <GiWallet className="size-5 text-green-600" />,
        description: "Direct cash collection from resident. No transaction ID required.",
        hasTransactionId: false
    },
    {
        value: "offline",
        label: "Offline",
        icon: <FaCashRegister className="size-5 text-orange-600" />,
        refLabel: "Reference/Receipt No.",
        placeholder: "Enter manual receipt number",
        hasTransactionId: true
    },
    {
        value: "upi",
        label: "UPI",
        image: "/assets/upi-logo.png",
        refLabel: "UPI Transaction ID",
        placeholder: "UTR / Ref Number",
        hasTransactionId: true
    },
    {
        value: "online_razorpay",
        label: "Razorpay",
        image: "/assets/online-razorpay-logo.png",
        refLabel: "Online Payment ID",
        placeholder: "pay_...",
        hasTransactionId: true
    }
];

export default function PaymentModeTabs({
    amountDue,
    paymentMode,
    setPaymentMode,
    transactionId,
    setTransactionId
}: PaymentModeTabsProps) {
    return (
        <Tabs defaultValue={paymentMode} onValueChange={setPaymentMode} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 p-1 bg-muted/50 group-data-[orientation=horizontal]/tabs:h-auto">
                {PAYMENT_MODES.map((mode) => (
                    <TabsTrigger
                        key={mode.value}
                        value={mode.value}
                        className="flex flex-col gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        {mode.image ? (
                            <Image src={mode.image} alt={mode.label} width={32} height={12} className="h-4 object-contain" />
                        ) : (
                            mode.icon
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{mode.label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Amount Due:</span>
                    <span className="font-bold text-lg">₹{amountDue.toLocaleString('en-IN')}</span>
                </div>

                {PAYMENT_MODES.map((mode) => (
                    <TabsContent key={mode.value} value={mode.value} className="mt-0">
                        {mode.hasTransactionId ? (
                            <div className="space-y-1.5">
                                <Label htmlFor={`ref-${mode.value}`} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {mode.refLabel}
                                </Label>
                                <Input
                                    id={`ref-${mode.value}`}
                                    placeholder={mode.placeholder}
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground text-center bg-green-50 text-green-700 py-2 rounded-md border border-green-100">
                                {mode.description}
                            </p>
                        )}
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}
