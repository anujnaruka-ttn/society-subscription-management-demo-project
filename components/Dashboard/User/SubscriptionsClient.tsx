"use client";

import dynamic from "next/dynamic";

const ResidentSubscriptionsTable = dynamic(
    () => import("@/components/Tables/User/ResidentSubscriptions"),
    { ssr: false }
);

export default function ResidentSubscriptionsClient() {
    return <ResidentSubscriptionsTable />;
}
