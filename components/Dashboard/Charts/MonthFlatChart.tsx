"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "Monthly flats bar chart"

const chartConfig = {
    flats: {
        label: "Flats",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function MonthFlatsChart({ data }: { data?: any[] }) {
    // Use passed data or fallback to empty array
    const chartDataToUse = data && data.length > 0 ? data : [];
    return (
        <Card className="h-[25%] w-full gap-1.5 py-3">
            <CardHeader>
                <CardTitle>Monthly Flats</CardTitle>
                <CardDescription>Showing flats count per month</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-full">
                <ChartContainer config={chartConfig} className="w-full h-[75%]">
                    <BarChart accessibilityLayer data={chartDataToUse}>
                        <CartesianGrid vertical={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="flats" fill="var(--chart-1)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
