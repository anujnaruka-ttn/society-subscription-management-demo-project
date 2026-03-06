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

export default function MoneyCollectedChart() {
  const [state] = useState<{ series: any; options: ApexOptions }>({
    series: [
      {
        name: "Budget",
        type: "area",
        data: [
          [1327359600000, 0.95],
          [1327446000000, 1.34],
          [1327532400000, 1.18],
          [1327618800000, 1.05],
          [1327878000000, 1.0],
          [1327964400000, 0.95],
          [1328050800000, 1.24],
          [1328137200000, 1.29],
          [1328223600000, 1.85],
          [1328482800000, 1.86],
          [1328569200000, 2.28],
          [1328655600000, 2.1],
          [1328742000000, 2.65],
          [1328828400000, 2.21],
          [1329087600000, 2.35],
          [1329174000000, 2.44],
          [1329260400000, 2.46],
          [1329346800000, 2.86],
          [1329433200000, 2.75],
          [1329778800000, 2.54],
          [1329865200000, 2.33],
          [1329951600000, 2.97],
          [1330038000000, 3.41],
          [1330297200000, 3.27],
          [1330383600000, 3.27],
          [1330470000000, 2.89],
          [1330556400000, 3.1],
        ] as DataPoint[],
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