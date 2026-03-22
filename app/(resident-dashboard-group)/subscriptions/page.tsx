"use client";

import { useSearchParams } from "next/navigation";
import SubscriptionsClient from "@/components/Dashboard/Resident/SubscriptionsClient";

export default function ResidentSubscriptionsPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const month = searchParams.get("month");
    
    return <SubscriptionsClient paymentId={paymentId} month={month} />;
}
