"use client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher"

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { ExpressionCharts } from "@/components/expression-charts";
import { TopTenCard } from "@/components/top-ten-card";
import { TopStudents } from "@/components/top-students";

export default function Page() {
    const [moods] = useState([
        { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
        { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
        { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
        { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
        { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
        { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
        { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" }
    ]);

    const positiveClasses = [
        { name: "Mathematics 101", happiness: "85", students: 30 },
        { name: "Physics Advanced", happiness: "82", students: 25 },
        { name: "Chemistry Lab", happiness: "80", students: 28 },
        { name: "Biology 201", happiness: "78", students: 22 },
        { name: "Computer Science", happiness: "77", students: 35 },
        { name: "English Literature", happiness: "75", students: 27 },
        { name: "History 101", happiness: "73", students: 31 },
        { name: "Art Class", happiness: "72", students: 20 },
        { name: "Music Theory", happiness: "70", students: 24 },
        { name: "Physical Education", happiness: "69", students: 33 },
    ];

    const [, setCurrentTime] = useState(new Date());  
  
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (    
        <SidebarProvider>
            <AppSidebarTeacher />
            <SidebarInset className="h-screen flex flex-col overflow-y-auto overflow-x-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/teacher">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>                
                            </BreadcrumbList>              
                        </Breadcrumb>            
                    </div>          
                    <div className="flex items-center">
                        <div className="relative">
                            <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-2 sm:p-4 pt-0">            
                    <div className="h-full flex flex-col gap-2 sm:gap-4">
                        <ExpressionCharts moods={moods} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-5 flex-1">
                            <TopStudents />
                            <TopTenCard
                                title="Top 10 Classes with Positive Expression"
                                type="classes"
                                data={positiveClasses}
                            />
                        </div>
                    </div>          
                </div>
            </SidebarInset>
        </SidebarProvider>    
    );
}