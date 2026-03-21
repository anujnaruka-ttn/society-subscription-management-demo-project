import { use } from "react";

export default async function PaymentPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const { flatId } = await searchParams;
    return (
        <div>PaymentPage</div>
    )
}
