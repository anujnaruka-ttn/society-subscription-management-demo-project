import MonthSubscriptionDetails from "@/components/Dashboard/Resident/MonthSubscriptionDetails";

export default async function ResidentSingleSubscriptionDetailsPage({ params }: { params: Promise<{ month: string }> }) {

    const {month} = await params;

    return (
        <MonthSubscriptionDetails month={month || ""} />
    )
}
