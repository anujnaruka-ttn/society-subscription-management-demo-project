"use client";

import dynamic from "next/dynamic";

const ResidentSubscriptionsTable = dynamic(
    () => import("@/components/Tables/User/ResidentSubscriptions"),
    { ssr: false }
);

interface SubscriptionsClientProps {
    paymentId?: string | null;
    month?: string | null;
}

export default function ResidentSubscriptionsClient({ paymentId, month }: SubscriptionsClientProps) {
    return <ResidentSubscriptionsTable paymentId={paymentId} month={month} />;
}
