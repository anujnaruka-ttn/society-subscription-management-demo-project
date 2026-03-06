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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const chartData = [
    { date: "2024-04-01", flats: 222, amount: 150 },
    { date: "2024-04-02", flats: 97, amount: 180 },
    { date: "2024-04-03", flats: 167, amount: 120 },
    { date: "2024-04-04", flats: 242, amount: 260 },
    { date: "2024-04-05", flats: 373, amount: 290 },
    { date: "2024-04-06", flats: 301, amount: 340 },
    { date: "2024-04-07", flats: 245, amount: 180 },
    { date: "2024-04-08", flats: 409, amount: 320 },
    { date: "2024-04-09", flats: 59, amount: 110 },
    { date: "2024-04-10", flats: 261, amount: 190 },
    { date: "2024-04-11", flats: 327, amount: 350 },
    { date: "2024-04-12", flats: 292, amount: 210 },
    { date: "2024-04-13", flats: 342, amount: 380 },
    { date: "2024-04-14", flats: 137, amount: 220 },
    { date: "2024-04-15", flats: 120, amount: 170 },
    { date: "2024-04-16", flats: 138, amount: 190 },
    { date: "2024-04-17", flats: 446, amount: 360 },
    { date: "2024-04-18", flats: 364, amount: 410 },
    { date: "2024-04-19", flats: 243, amount: 180 },
    { date: "2024-04-20", flats: 89, amount: 150 },
    { date: "2024-04-21", flats: 137, amount: 200 },
    { date: "2024-04-22", flats: 224, amount: 170 },
    { date: "2024-04-23", flats: 138, amount: 230 },
    { date: "2024-04-24", flats: 387, amount: 290 },
    { date: "2024-04-25", flats: 215, amount: 250 },
    { date: "2024-04-26", flats: 75, amount: 130 },
    { date: "2024-04-27", flats: 383, amount: 420 },
    { date: "2024-04-28", flats: 122, amount: 180 },
    { date: "2024-04-29", flats: 315, amount: 240 },
    { date: "2024-04-30", flats: 454, amount: 380 },
    { date: "2024-05-01", flats: 165, amount: 220 },
    { date: "2024-05-02", flats: 293, amount: 310 },
    { date: "2024-05-03", flats: 247, amount: 190 },
    { date: "2024-05-04", flats: 385, amount: 420 },
    { date: "2024-05-05", flats: 481, amount: 390 },
    { date: "2024-05-06", flats: 498, amount: 520 },
    { date: "2024-05-07", flats: 388, amount: 300 },
    { date: "2024-05-08", flats: 149, amount: 210 },
    { date: "2024-05-09", flats: 227, amount: 180 },
    { date: "2024-05-10", flats: 293, amount: 330 },
    { date: "2024-05-11", flats: 335, amount: 270 },
    { date: "2024-05-12", flats: 197, amount: 240 },
    { date: "2024-05-13", flats: 197, amount: 160 },
    { date: "2024-05-14", flats: 448, amount: 490 },
    { date: "2024-05-15", flats: 473, amount: 380 },
    { date: "2024-05-16", flats: 338, amount: 400 },
    { date: "2024-05-17", flats: 499, amount: 420 },
    { date: "2024-05-18", flats: 315, amount: 350 },
    { date: "2024-05-19", flats: 235, amount: 180 },
    { date: "2024-05-20", flats: 177, amount: 230 },
    { date: "2024-05-21", flats: 82, amount: 140 },
    { date: "2024-05-22", flats: 81, amount: 120 },
    { date: "2024-05-23", flats: 252, amount: 290 },
    { date: "2024-05-24", flats: 294, amount: 220 },
    { date: "2024-05-25", flats: 201, amount: 250 },
    { date: "2024-05-26", flats: 213, amount: 170 },
    { date: "2024-05-27", flats: 420, amount: 460 },
    { date: "2024-05-28", flats: 233, amount: 190 },
    { date: "2024-05-29", flats: 78, amount: 130 },
    { date: "2024-05-30", flats: 340, amount: 280 },
    { date: "2024-05-31", flats: 178, amount: 230 },
    { date: "2024-06-01", flats: 178, amount: 200 },
    { date: "2024-06-02", flats: 470, amount: 410 },
    { date: "2024-06-03", flats: 103, amount: 160 },
    { date: "2024-06-04", flats: 439, amount: 380 },
    { date: "2024-06-05", flats: 88, amount: 140 },
    { date: "2024-06-06", flats: 294, amount: 250 },
    { date: "2024-06-07", flats: 323, amount: 370 },
    { date: "2024-06-08", flats: 385, amount: 320 },
    { date: "2024-06-09", flats: 438, amount: 480 },
    { date: "2024-06-10", flats: 155, amount: 200 },
    { date: "2024-06-11", flats: 92, amount: 150 },
    { date: "2024-06-12", flats: 492, amount: 420 },
    { date: "2024-06-13", flats: 81, amount: 130 },
    { date: "2024-06-14", flats: 426, amount: 380 },
    { date: "2024-06-15", flats: 307, amount: 350 },
    { date: "2024-06-16", flats: 371, amount: 310 },
    { date: "2024-06-17", flats: 475, amount: 520 },
    { date: "2024-06-18", flats: 107, amount: 170 },
    { date: "2024-06-19", flats: 341, amount: 290 },
    { date: "2024-06-20", flats: 408, amount: 450 },
    { date: "2024-06-21", flats: 169, amount: 210 },
    { date: "2024-06-22", flats: 317, amount: 270 },
    { date: "2024-06-23", flats: 480, amount: 530 },
    { date: "2024-06-24", flats: 132, amount: 180 },
    { date: "2024-06-25", flats: 141, amount: 190 },
    { date: "2024-06-26", flats: 434, amount: 380 },
    { date: "2024-06-27", flats: 448, amount: 490 },
    { date: "2024-06-28", flats: 149, amount: 200 },
    { date: "2024-06-29", flats: 103, amount: 160 },
    { date: "2024-06-30", flats: 446, amount: 400 },
]

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

export function ChartAreaInteractive() {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

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
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-full">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                >
                    <AreaChart data={filteredData}>
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
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
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
