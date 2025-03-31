"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
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
import { useEffect, useState } from "react"
import { getAllClassSubjects } from "@/services/classSubjectAppService"
import { toast } from "sonner"

const chartConfig = {
  subjects: {
    label: "Subjects",
  },
  current: {
    label: "Current",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig

export function SubjectsPieChart () {
    const [chartData, setChartData] = useState([
        { subjectStatus: "current", subjects: 0, fill: "var(--color-current)" },
        { subjectStatus: "completed", subjects: 0, fill: "var(--color-completed)" },  
      ]);

    useEffect(() => {        
        const fetchUsers = async () => {
          try {         
            const response = await getAllClassSubjects();
            if (!response.success) {
              throw new Error(response.message);
            }      
            const subjects = response.data; // Assuming API returns an array of users
            console.log(subjects);
            // Count users by status
            const subjectStatus = {
            current: 0,
            completed: 0,            
            };

            subjects.forEach((subject: { status: string }) => {
                const statusKey = subject.status.toLowerCase() as keyof typeof subjectStatus; // Ensure lowercase and type
                if (subjectStatus[statusKey] !== undefined) {
                    subjectStatus[statusKey]++;
                }
              });
            console.log(subjectStatus);
            // Update chart data
            setChartData((prev) =>
            prev.map((item) => ({
                ...item,
                subjects: subjectStatus[item.subjectStatus as keyof typeof subjectStatus] || 0,
            }))
            );

          } catch (error) {
            console.log("Error fetching class subject:", error);
            toast.error("Failed to fetch class subject!", {
              description: error instanceof Error ? error.message : JSON.stringify(error),
            });
          }          
        }
    
        fetchUsers();    
      }, []);  

  const totalSubjects = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.subjects, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Subjects</CardTitle>        
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="subjects"
              nameKey="subjectStatus"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSubjects.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Subjects
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">        
        <div className="leading-none text-muted-foreground">
          Showing total subjects
        </div>
      </CardFooter>
    </Card>
  )
}
