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
import { getAllUsers } from "@/services/userAppService"
import { toast } from "sonner"

const chartConfig = {
  users: {
    label: "Users",
  },
  new: {
    label: "New",
    color: "hsl(var(--chart-1))",
  },
  activated: {
    label: "Activated",
    color: "hsl(var(--chart-2))",
  },
  disabled: {
    label: "Disabled",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig

export function UserStatusPieChart () {
    const [chartData, setChartData] = useState([
        { userStatus: "new", users: 0, fill: "var(--color-new)" },
        { userStatus: "activated", users: 0, fill: "var(--color-activated)" },
        { userStatus: "disabled", users: 0, fill: "var(--color-disabled)" },
      ]);

    useEffect(() => {        
        const fetchUsers = async () => {
          try {         
            const response = await getAllUsers();
            if (!response.success) {
              throw new Error(response.message);
            }      
            const users = response.data; // Assuming API returns an array of users

            // Count users by status
            const statusCounts = {
            new: 0,
            activated: 0,
            disabled: 0,
            };

            users.forEach((user: { account_status: string }) => {
                const statusKey = user.account_status.toLowerCase() as keyof typeof statusCounts; // Ensure lowercase and type
                if (statusCounts[statusKey] !== undefined) {
                  statusCounts[statusKey]++;
                }
              });
      
              // Update chart data
              setChartData((prev) =>
                prev.map((item) => ({
                  ...item,
                  users: statusCounts[item.userStatus as keyof typeof statusCounts] || 0,
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

  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.users, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Users Status</CardTitle>        
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="userStatus"
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold">
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
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
          Showing total users registered
        </div>
      </CardFooter>
    </Card>
  )
}
