"use client"

import { TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

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
} from "@/components/ui/chart"

// Emotion categories in specific order
const emotions = [
  "Fearful",
  "Angry",
  "Disgusted",
  "Sad",
  "Neutral",
  "Happy",
  "Surprised",
]

// Chart data with dominant emotion per minute
const chartData = [
  { time: "00:01", emotion: "Surprised", percentage: 70, fill: "hsl(17.5, 88.3%, 40.4%)" },
  { time: "00:02", emotion: "Happy", percentage: 60, fill: "hsl(142.4, 71.8%, 29.2%)" },
  { time: "00:03", emotion: "Neutral", percentage: 50, fill: "hsl(224.3, 76.3%, 48%)" },
  { time: "00:04", emotion: "Angry", percentage: 80, fill: "hsl(0, 73.7%, 41.8%)" },
  { time: "00:05", emotion: "Sad", percentage: 65, fill: "hsl(272.1, 71.7%, 47.1%)" },
  { time: "00:06", emotion: "Fearful", percentage: 55, fill: "hsl(215.3, 25%, 26.7%)" },
  { time: "00:07", emotion: "Disgusted", percentage: 75, fill: "hsl(240, 5.3%, 26.1%)" },
  { time: "00:08", emotion: "Surprised", percentage: 75, fill: "hsl(17.5, 88.3%, 40.4%)" },
  { time: "00:09", emotion: "Neutral", percentage: 75, fill: "hsl(224.3, 76.3%, 48%)" },
  { time: "00:10", emotion: "Sad", percentage: 75, fill: "hsl(272.1, 71.7%, 47.1%)" },
]

// Chart config
const chartConfig = {
  emotion: {
    label: "Dominant-",    
    color: "hsl(var(--chart-1))",
  },
}

export function FERTimeLineChart() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Dominant Emotion Over Time</CardTitle>
        <CardDescription>Tracking the most dominant emotion per minute</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <LineChart data={chartData} margin={{ top: 24, left: 24, right: 24 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "var(--foreground)" }} />
                <YAxis dataKey="emotion" type="category" tick={{ fill: "var(--foreground)" }} domain={emotions} // Ensure correct order
                  tickFormatter={(tick) => tick}/>             
                  <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) return null;

                        const dataPoint = payload[0].payload; // Extract data

                        return (
                          <div className="p-2 bg-white shadow-md rounded-md border border-gray-300">
                            <p className="text-sm font-medium">{dataPoint.time}</p>
                            <p className="text-sm text-gray-700">
                              <strong>{dataPoint.emotion}</strong>: {dataPoint.percentage}%
                            </p>
                          </div>
                        );
                      }}
                    />
                <Line
                  dataKey="emotion"
                  type="monotone"
                  stroke="var(--color-emotion)"
                  strokeWidth={2}
                  dot={({ payload, ...props }) => (
                    <Dot
                      key={payload.time}
                      r={5}
                      cx={props.cx}
                      cy={props.cy}
                      fill={payload.fill}
                      stroke={payload.fill}
                    />
                  )}
                />
              </LineChart>
            </ChartContainer>   
          </ResponsiveContainer>          
        </div> 
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Emotional trends for the session <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tracking the most dominant emotion per minute.
        </div>
      </CardFooter>
    </Card>
  )
}
