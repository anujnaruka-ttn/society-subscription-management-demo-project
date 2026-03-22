"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { toast } from "sonner";
import openRazorpay from "@/lib/razorpay";

interface PaymentComponentProps {
    amount: number;
    flatId?: string;
    monthYear?: string;
}

export default function PaymentComponent({ amount, flatId, monthYear }: PaymentComponentProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Dynamically load the Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up the script if the component unmounts
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        setIsProcessing(true);
        
        try {
           const razorpayInstance = openRazorpay(amount, flatId, monthYear);
           if (razorpayInstance) {
               razorpayInstance.open();
            } else {
               toast.error("Payment service not available. Please try again later.");
           }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to initiate payment");
        } finally {
            setIsProcessing(false);
        }

    };

    return (
        <div className="flex items-center justify-center w-full h-full bg-primary">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Amount to be paid</p>
                        <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                            <IndianRupee className="w-8 h-8" />
                            <span>{amount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-3 text-lg"
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
