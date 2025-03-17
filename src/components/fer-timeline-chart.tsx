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
import { useState, useEffect } from "react";
import { ClassStduentFERAggTimelineModel } from "@/models/classStudentFERAggTimelineModel"

// Emotion categories in specific order
const emotions = [
  "na",
  "fearful",
  "angry",
  "disgusted",
  "sad",
  "neutral",
  "happy",
  "surprised",  
]

const chartConfig = { 
  surprised: {
    emotion: "surprised",
    fill: "hsl(30, 100%, 50%)", // Bright orange
  },
  happy: {
    emotion: "happy",
    fill: "hsl(120, 100%, 40%)", // Bright green
  },
  neutral: {
    emotion: "neutral",
    fill: "hsl(210, 20%, 50%)", // Neutral gray
  },
  sad: {
    emotion: "sad",
    fill: "hsl(240, 100%, 50%)", // Cool blue
  },
  disgusted: {
    emotion: "disgusted",
    fill: "hsl(60, 100%, 20%)", // Olive
  },
  angry: {
    emotion: "angry",
    fill: "hsl(0, 100%, 50%)", // Intense red
  },
  fearful: {
    emotion: "fearful",
    fill: "hsl(210, 30%, 30%)", // Dark gray
  },  
  na: {
    label: "NA",
    fill: "hsl(222.2, 84%, 4.9%)", // Dark gray
  },
}

// Chart config
const chartConfigDominant = {
  emotion: {
    label: "Dominant-",    
    color: "hsl(var(--chart-1))",
  },
}

interface FERTimeLineChartProps {
  data: ClassStduentFERAggTimelineModel[];
}

export function FERTimeLineChart({ data }: FERTimeLineChartProps) {

const [chartData, setChartData] = useState<{
    time: string;
    emotion: string;
    percentage: number;
    fill: string;
    }[]>([]);

    useEffect(() => {
      const processChartData = () => {
        const groupedData: { [key: string]: { emotion: string; percentage: number } } = {};              
        data.forEach((item) => {          
          const formattedTime = new Date(item.minute_group).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
      
          groupedData[formattedTime] = {
            emotion: item.dominant_expression,
            percentage: item.highest_avg_value,
          };
        });
      
        // Convert to chart format without sorting times
        const processedChartData = Object.keys(groupedData).map((time) => {
          const { emotion, percentage } = groupedData[time];
          return {
            time,
            emotion,
            percentage,
            fill: chartConfig[emotion.toLowerCase() as keyof typeof chartConfig]?.fill || "hsl(0, 0%, 50%)",
          };
        });              

        return processedChartData;
      };

      const processedData = processChartData();
      setChartData(processedData);      
    }, [data]);  
    
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dominant Emotion Over Time</CardTitle>
        <CardDescription>Tracking the most dominant emotion per minute</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfigDominant}>
              {chartData.length > 0 ? (
              <LineChart data={chartData} margin={{ top: 24, left: 24, right: 24 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "var(--foreground)" }} />
                <YAxis
                    type="category"
                    dataKey="emotion"
                    tick={{ fill: "var(--foreground)" }}
                    domain={[...emotions]} // Explicitly ensure all emotions are listed
                    allowDuplicatedCategory={false} // Prevent duplicate categories from being removed
                    tickFormatter={(tick) => tick}
                  />
                <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const dataPoint = payload[0].payload;
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
                  dot={({ payload, index, ...props }) => (
                    <Dot
                        key={`${payload.time}-${index}`}
                        r={3}
                        cx={props.cx}
                        cy={props.cy}
                        fill={payload.fill} // Uses the correct color for the dominant emotion
                        stroke={payload.fill}
                      />
                  )}/>
              </LineChart>
              ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-2xl font-medium">
                No data available
              </div>
              )}
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Emotional trends for the session <TrendingUp className="h-4 w-4" />
        </div>        
      </CardFooter>
    </Card>
  );
}
