import CommonHeader from "@/components/Dashboard/common/CommonHeader";

export default function SubscriptionsLayout({ children }: { children: React.ReactNode }) {
    return (
        <CommonHeader
            title="My Subscriptions"
            description="View your monthly billing history, payment status, and receipt details."
        >
            {children}
        </CommonHeader>
    );
}
