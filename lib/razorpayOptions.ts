import { toast } from "sonner";
import { IRazorpayOptions } from "@/types/razorpay";

const getRazorpayOptions = (amount: number, flatId?: string, monthYear?: string): IRazorpayOptions => ({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    amount: 0, // Test amount in paise
    // amount: amount * 100, Razorpay works in paise
    currency: "INR",
    name: "Society Subscription",
    description: "Monthly subscription payment",
    image: "/assets/logo-main.png", // Add your logo if available
    handler: function (response: any) {
        toast.success("Payment successful!");
        // Handle successful payment here
        // You might want to redirect to a success page or show a success message
        if (response.razorpay_payment_id) {
            const baseUrl = "/subscriptions";
            const params = new URLSearchParams();
            params.append("payment_id", response.razorpay_payment_id);
            if (monthYear) {
                params.append("month", monthYear);
            }
            window.location.href = `${baseUrl}?${params.toString()}`;
        }
    },
    prefill: {
        name: "", // Can be filled with user data
        email: "", // Can be filled with user data
        contact: "", // Can be filled with user data
    },
    notes: {
        flatId: flatId || "",
        address: "Society Subscription Payment",
    },
    theme: {
        color: "#3399cc",
    },
    config: {
        display: {
            blocks: {
                banks: {
                    name: 'All Payment Options',
                    instruments: [
                        {
                            method: 'upi'
                        },
                        {
                            method: 'card'
                        },
                        {
                            method: 'wallet'
                        },
                        {
                            method: 'netbanking'
                        }
                    ],
                },
            },
            sequence: ['block.banks'],
            preferences: {
                show_default_blocks: false,
                hide: ["emi"],
            },
        },
    },
});

export default getRazorpayOptions;