"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ClassStudentFERAggChartModel } from "@/models/classStudentFERAggChartModel";
import { ChartPie } from "lucide-react";

const chartConfig = { 
  surprised: {
    label: "Surprised",
    color: "hsl(30, 100%, 50%)", // Bright orange
  },
  happy: {
    label: "Happy",
    color: "hsl(120, 100%, 40%)", // Bright green
  },
  neutral: {
    label: "Neutral",
    color: "hsl(210, 20%, 50%)", // Neutral gray
  },
  sad: {
    label: "Sad",
    color: "hsl(240, 100%, 50%)", // Cool blue
  },
  disgusted: {
    label: "Disgusted",
    color: "hsl(60, 100%, 20%)", // Olive
  },
  angry: {
    label: "Angry",
    color: "hsl(0, 100%, 50%)", // Intense red
  },
  fearful: {
    label: "Fearful",
    color: "hsl(210, 30%, 30%)", // Dark gray
  },
  na: {
    label: "NA",
    color: "hsl(222.2, 84%, 4.9%)", // Black
  },
} satisfies ChartConfig;

interface FERPieChartProps {
  data: ClassStudentFERAggChartModel;
}

export function FERPieChart({ data }: FERPieChartProps) {  
  if (!data) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Facial Expression Recognition</CardTitle>
          <CardDescription>Tracking the most dominant emotion per schedule.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <svg viewBox="0 0 100 100" className="mx-auto aspect-square max-h-[300px]">
            <circle cx="50" cy="50" r="40" fill="hsl(0, 0%, 90%)" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(0, 0%, 50%)"
              fontSize="8">
              No data available
            </text>
          </svg>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.keys(data).map((key) => ({    
    emotion: chartConfig[key as keyof typeof chartConfig]?.label.toLowerCase() || key,
    average: Number(data[key as keyof ClassStudentFERAggChartModel]), // Convert to number
    fill: chartConfig[key as keyof typeof chartConfig]?.color || "hsl(0, 0%, 50%)",
  }));  

  // Check if all values are zero
  const allValuesZero = chartData.every((item) => item.average === 0);

  if (allValuesZero) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Facial Expression Recognition</CardTitle>
          <CardDescription>Tracking the most dominant emotion per schedule.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <svg viewBox="0 0 100 100" className="mx-auto aspect-square max-h-[300px]">
            <circle cx="50" cy="50" r="40" fill="hsl(0, 0%, 90%)" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(0, 0%, 50%)"
              fontSize="8">
              No data available
            </text>
          </svg>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Facial Expression Recognition</CardTitle>        
        <CardDescription>Tracking the most dominant emotion per schedule.</CardDescription>
      </CardHeader>      
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-h-[500px] w-full">
            {chartData.length > 0 ? (
              <PieChart>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Pie 
                  data={chartData} 
                  dataKey="average" 
                  nameKey="emotion" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={120}/>
                <ChartLegend
                  content={
                    <ChartLegendContent
                      nameKey="emotion"
                      payload={chartData.map((entry) => ({
                        value: entry.emotion,
                        color: entry.fill,
                        key: entry.emotion, // Ensure a unique key
                      }))}
                    />
                  }
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>                
            ) : (
                <svg viewBox="0 0 100 100" className="mx-auto aspect-square max-h-[300px]">
                  <circle cx="50" cy="50" r="40" fill="hsl(0, 0%, 90%)" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="hsl(0, 0%, 50%)"
                    fontSize="8">
                    No data available
                  </text>
                </svg>
            )}
          </ChartContainer>
        </ResponsiveContainer>        
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average expression trends for each schedule <ChartPie className="h-4 w-4" />
        </div>        
      </CardFooter>
    </Card>
  )
}
