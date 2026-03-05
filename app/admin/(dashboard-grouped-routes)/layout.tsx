import type { Metadata } from "next";
import "@/app/globals.css";
import { headers } from "next/headers";


export const metadata: Metadata = {
    title: `Society Subscription Management | ${"9"}`,
    description: "Society Subscription Management is a web application designed to help manage and track subscriptions for various societies. It provides features such as subscription tracking, payment management, and member management to streamline the subscription process for society administrators and members.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headersVal = headers();
    console.log(headersVal);
    return (
        <main className="w-full h-full overflow-hidden flex flex-col justify-center items-center">
            {children}
        </main>
    );
}