"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  CardContent,
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
import { Smile, Meh, Frown, XCircle, Laugh, Angry } from "lucide-react"

const chartData = [
  {
    minute: "1",
    happy: 75,
    neutral: 60,
    sad: 45,
    disgusted: 30,
    fearful: 15,
    angry: 5
  },
  {
    minute: "2",
    happy: 82,
    neutral: 55,
    sad: 48,
    disgusted: 25,
    fearful: 20,
    angry: 8
  },
  {
    minute: "3",
    happy: 70,
    neutral: 62,
    sad: 40,
    disgusted: 35,
    fearful: 28,
    angry: 15
  },
  {
    minute: "4",
    happy: 58,
    neutral: 65,
    sad: 52,
    disgusted: 42,
    fearful: 35,
    angry: 22
  },
  {
    minute: "5",
    happy: 48,
    neutral: 70,
    sad: 58,
    disgusted: 45,
    fearful: 40,
    angry: 35
  },
  {
    minute: "6",
    happy: 55,
    neutral: 58,
    sad: 50,
    disgusted: 40,
    fearful: 35,
    angry: 28
  },
  {
    minute: "7",
    happy: 68,
    neutral: 55,
    sad: 45,
    disgusted: 35,
    fearful: 28,
    angry: 20
  },
  {
    minute: "8",
    happy: 78,
    neutral: 52,
    sad: 40,
    disgusted: 32,
    fearful: 25,
    angry: 15
  },
  {
    minute: "9",
    happy: 85,
    neutral: 48,
    sad: 35,
    disgusted: 28,
    fearful: 20,
    angry: 10
  },
  {
    minute: "10",
    happy: 92,
    neutral: 45,
    sad: 32,
    disgusted: 25,
    fearful: 15,
    angry: 5
  }
]

const chartConfig = {
  happy: {
    label: "Happy",
    color: "hsl(var(--success))",
    icon: Smile,
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--muted))",
    icon: Meh,
  },
  sad: {
    label: "Sad",
    color: "hsl(var(--warning))",
    icon: Frown,
  },
  disgusted: {
    label: "Disgusted",
    color: "hsl(var(--destructive))",
    icon: XCircle,
  },
  fearful: {
    label: "Fearful",
    color: "hsl(var(--secondary))",
    icon: Laugh,
  },
  angry: {
    label: "Angry",
    color: "hsl(var(--primary))",
    icon: Angry,
  },
} satisfies ChartConfig

export function Component() {
  return (
    <>
      <CardHeader>
        <CardTitle>Real-time Expression Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 32,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="minute"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: "Time (minutes)", position: "bottom" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: "Expressions Count", angle: -90, position: "left" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            {Object.entries(chartConfig).map(([key, config]) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={config.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing expressions per minute
        </div>
      </CardFooter>
    </>
  )
}
