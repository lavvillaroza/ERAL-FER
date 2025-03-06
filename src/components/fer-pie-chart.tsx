"use client"

import { Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "surprised", visitors: 275, fill: "hsl(17.5, 88.3%, 40.4%)" },
  { browser: "happy", visitors: 200, fill: "hsl(142.4, 71.8%, 29.2%)" },
  { browser: "neutral", visitors: 187, fill: "hsl(224.3, 76.3%, 48%)" },
  { browser: "sad", visitors: 173, fill: "hsl(272.1, 71.7%, 47.1%)" },
  { browser: "disgusted", visitors: 90, fill: "hsl(240, 5.3%, 26.1%)" },
  { browser: "angry", visitors: 90, fill: "hsl(0, 73.7%, 41.8%)" },
  { browser: "fearful", visitors: 90, fill: "hsl(215.3, 25%, 26.7%)" },
]

const chartConfig = { 
  surprised: {
    label: "Surprised",
    color: "hsl(17.5, 88.3%, 40.4%",
  },
  happy: {
    label: "Happy",
    color: "hsl(142.4, 71.8%, 29.2%)",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(224.3, 76.3%, 48%)",
  },
  sad: {
    label: "Sad",
    color: "hsl(272.1, 71.7%, 47.1%)",
  },
  disgusted: {
    label: "Disgusted",
    color: "hsl(240, 5.3%, 26.1%)",
  },
  angry: {
    label: "Angry",
    color: "hsl(0, 73.7%, 41.8%)",
  },
  fearful: {
    label: "Fearful",
    color: "hsl(215.3, 25%, 26.7%)",
  },
} satisfies ChartConfig

export function FERPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Facial Expression Recognition</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <Pie data={chartData} dataKey="visitors" />
              <ChartLegend
                content={<ChartLegendContent nameKey="browser" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>        
      </CardContent>
    </Card>
  )
}
