'use client'

import React, { useEffect, useState } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/app/components/app-sidebar-admin";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ExpressionCharts } from "@/components/expression-charts";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TopClassesCard } from "@/components/top-classes-card";

export default function Page() {
  // Previous state definitions remain the same until topClasses
  const [moods] = useState([
    { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
    { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
    { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
    { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
    { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
    { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" }
  ]);

  const [notifications] = useState([
    { id: 1, name: "John Smith", time: "2 minutes ago", class: "Mathematics 101", role: "student" },
    { id: 2, name: "Sarah Johnson", time: "5 minutes ago", class: "Physics 202", role: "teacher" },
    { id: 3, name: "Mike Williams", time: "10 minutes ago", class: "Chemistry 301", role: "admin" },
  ]);

  const [topClasses] = useState([
    { 
      id: 1, 
      name: "Mathematics 101",
      students: 45,
      emotions: {
        happy: 35,
        surprised: 30,
        neutral: 27
      }
    },
    { 
      id: 2, 
      name: "Physics 202",
      students: 38,
      emotions: {
        happy: 32,
        surprised: 28,
        neutral: 28
      }
    },
    { 
      id: 3, 
      name: "Chemistry 301",
      students: 42,
      emotions: {
        happy: 30,
        surprised: 25,
        neutral: 30
      }
    },
    { 
      id: 4, 
      name: "Biology 201",
      students: 36,
      emotions: {
        happy: 28,
        surprised: 27,
        neutral: 28
      }
    },
    { 
      id: 5, 
      name: "Computer Science 101",
      students: 50,
      emotions: {
        happy: 25,
        surprised: 30,
        neutral: 27
      }
    },
  ]);

  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest of the component remains the same until the topClasses mapping
  return (    
    <SidebarProvider>
      <AppSidebarAdmin />
      <SidebarInset>
        {/* Header section remains the same */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>                
              </BreadcrumbList>              
            </Breadcrumb>            
          </div>          
          <div className="flex items-center space-x-4 px-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">            
          <div className="w-full">
            <ExpressionCharts moods={moods} chartSize={100} strokeWidth={10} className="mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                 {/* For Notifications Card */}
                 <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">                      
                    <h2 className="text-xl font-semibold mb-4">New Account Notifications</h2>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <Card key={notification.id}>
                            <CardContent className="p-4 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{notification.name}</p>
                                    <Badge variant="outline" className="capitalize">
                                      {notification.role}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">Registered for {notification.class}</p>
                                </div>
                                <span className="text-sm text-gray-500 ml-4">{notification.time}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* For Top Classes Card */}
                <TopClassesCard 
                  title="Top Classes with Positive Expressions"
                  classes={topClasses}
                  showEnrollment={true}
                />
            </div>
          </div>          
        </div>
      </SidebarInset>
    </SidebarProvider>    
  );
}