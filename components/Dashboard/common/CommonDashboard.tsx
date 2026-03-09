import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartAreaInteractive } from "../Charts/ChartAreaInteractive";
import MoneyCollectedChart from "../Charts/MoneyCollectedChart";
import { DayWiseChart } from "../Charts/DayWiseChart";
import PendingPaymentsTable from "@/components/Tables/Admin/PendingPayments";

type CommonDashboardProps = {
    role: "admin" | "user"
}

const CommonDashboard = (
    {
        props
    }: {
        props: CommonDashboardProps
    }) => {
    return (
        <Card className="w-full h-full mx-auto flex flex-row justify-center gap-3 border-none shadow-none bg-transparent rounded-t-none">
            {/* left side */}
            <Card className="w-[70%] h-full p-6">
                <CardContent className="px-0 h-full flex flex-col gap-y-3">
                    <ChartAreaInteractive />
                    <DayWiseChart />
                </CardContent>
            </Card>

            {/* right side */}
            <Card className="w-[25%] h-full">

                {/* money collected */}
                <Card className="h-[40%] bg-transparent border-none shadow-none py-1.5">
                    <CardHeader className="border-b border-border">
                        <CardTitle>
                            Money Collected
                        </CardTitle>
                        <CardDescription>
                            Showing money collected
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-3">
                        <MoneyCollectedChart />
                    </CardContent>
                </Card>

                <Card className="h-[60%] bg-transparent border-none shadow-none py-1.5 gap-0 overflow-hidden">
                    <CardHeader className="border-b border-border flex-1">
                        <CardTitle>
                            Pending Payment
                        </CardTitle>
                        <CardDescription>
                            Showing pending payment
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-1.5 h-[85%]">
                        <PendingPaymentsTable />
                    </CardContent>
                </Card>
            </Card>

        </Card>
    );
}

export default CommonDashboard;