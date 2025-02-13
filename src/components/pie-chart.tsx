"use client"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { expression: "happy", visitors: 130, fill: "var(--color-happy)" },
  { expression: "surprise", visitors: 170, fill: "var(--color-surprise)" },
  { expression: "angry", visitors: 150, fill: "var(--color-angry)" },
  { expression: "neutral", visitors: 173, fill: "var(--color-neutral)" },
  { expression: "sad", visitors: 90, fill: "var(--color-sad)" },
  { expression: "fearful", visitors: 120, fill: "var(--color-fearful)" },

]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  happy: {
    label: "Happy",
    color: "hsl(var(--chart-2))",
  },
  surprise: {
    label: "Surprise",
    color: "hsl(var(--chart-3))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-4))",
  },
  sad: {
    label: "Sad",
    color: "hsl(var(--chart-5))",
  },
  fearful: {
    label: "Fearful",
    color: "hsl(var(--chart-6))",
  },
  angry: {
    label: "Angry",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig

export function Component() {
  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="expression"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total expressions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
