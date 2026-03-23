"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

type DataPoint = [number, number]

interface TooltipParams {
  series: number[][];
  seriesIndex: number;
  dataPointIndex: number;
  w: any;
}

export default function MoneyCollectedChart({ data }: { data?: any[] }) {
  const [state] = useState<{ series: any; options: ApexOptions }>({
    series: [
      {
        name: "Budget",
        type: "area",
        data: data && data.length > 0 ? data : [] as DataPoint[],
      },
    ],
    options: {
      chart: {
        id: "budget-area",
        type: "area",
        height: 180,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        background: "transparent",
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        shape: "circle" as const,
      },
      xaxis: {
        type: "datetime" as const,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        theme: "dark" as const,
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
        custom: ({ series, seriesIndex, dataPointIndex }: TooltipParams) => {
          const value = series[seriesIndex][dataPointIndex]
          return `
            <div class="bg-background border border-border rounded-md p-2 text-foreground text-xs">
              <span>Money Collected: $${value.toFixed(2)}</span>
            </div>
          `
        },
      },
      fill: {
        type: "gradient" as const,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "var(--chart-2)",
              opacity: 0.4,
            },
            {
              offset: 100,
              color: "var(--chart-2)",
              opacity: 0.1,
            },
          ],
        },
      },
      stroke: {
        curve: "smooth" as const,
        width: 2,
        colors: ["var(--chart-2)"],
      },
      colors: ["var(--chart-2)"],
    },
  })

  return (
    <div className="h-fit w-full mt-2">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="area"
        height={160}
      />
    </div>
  )
}