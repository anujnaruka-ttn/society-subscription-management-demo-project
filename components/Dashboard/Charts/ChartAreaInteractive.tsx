"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
    amount: {
        label: "Amount",
        color: "var(--chart-1)",
    },
    flats: {
        label: "Flats",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: { data?: any[] }) {
    // Use passed data or fallback to empty array
    const chartDataToUse = data && data.length > 0 ? data : [];

    // Sort data by date to ensure proper chronological order (create a copy to avoid read-only error)
    const sortedData = [...chartDataToUse].sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return (
        <Card className="pt-0 h-[75%]">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>
                        Showing total flats data monthly along with
                        amount paid monthly by the resident.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-full">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                >
                    <AreaChart data={sortedData}>
                        <defs>
                            <linearGradient id="fillFlats" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        if (!value) return '';
                                        const date = new Date(value + 'T00:00:00');
                                        if (isNaN(date.getTime())) return value;
                                        return date.toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="amount"
                            type="natural"
                            fill="url(#fillAmount)"
                            stroke="var(--chart-1)"
                            stackId="a"
                        />
                        <Area
                            dataKey="flats"
                            type="natural"
                            fill="url(#fillFlats)"
                            stroke="var(--chart-2)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
