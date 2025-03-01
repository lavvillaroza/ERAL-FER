/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student"
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { ExpressionCharts } from "@/components/expression-charts";
import { Button } from "@/components/ui/button";

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


    const [selectedLesson, setSelectedLesson] = useState<any>(null);

    const scheduleWithExpressions = [
        { 
            title: "Introduction to Algebra", 
            date: "2023-10-15",
            time: "09:00 AM - 11:30 AM", 
            status: "Finished",
            remarks: "4.25",
            dominantExpression: "Happy",
            timeline: [
                { time: "9:00 AM", title: "Introduction to Numbers", desc: "Basic number theory and operations" },
                { time: "9:45 AM", title: "Variables", desc: "Understanding algebraic variables and constants" },
                { time: "10:30 AM", title: "Simple Equations", desc: "Solving basic algebraic equations" },
                { time: "11:15 AM", title: "Practice Problems", desc: "Hands-on practice with algebraic expressions" }
            ]
        },
        { 
            title: "Chemical Reactions", 
            date: "2023-10-16",
            time: "10:30 AM - 01:00 PM", 
            status: "Cancelled",
            remarks: "1.50",
            dominantExpression: "Surprised",
            timeline: [
                { time: "10:30 AM", title: "Types of Reactions", desc: "Overview of different chemical reaction types" },
                { time: "11:15 AM", title: "Balancing Equations", desc: "Learning to balance chemical equations" },
                { time: "12:00 PM", title: "Lab Safety", desc: "Safety protocols for chemical experiments" },
                { time: "12:45 PM", title: "Virtual Lab", desc: "Interactive simulation of chemical reactions" }
            ]
        },
        { 
            title: "World War II Overview", 
            date: "2023-10-17",
            time: "01:00 PM - 03:30 PM", 
            status: "Finished",
            remarks: "3.75",
            dominantExpression: "Neutral",
            timeline: [
                { time: "1:00 PM", title: "Causes of WWII", desc: "Analysis of events leading to World War II" },
                { time: "1:45 PM", title: "Major Battles", desc: "Key military campaigns and their significance" },
                { time: "2:30 PM", title: "Home Front", desc: "Civilian life during wartime" },
                { time: "3:15 PM", title: "War's End", desc: "Impact and aftermath of World War II" }
            ]
        },
        { 
            title: "Programming Basics", 
            date: "2023-10-18",
            time: "02:30 PM - 05:00 PM", 
            status: "Finished",
            remarks: "4.50",
            dominantExpression: "Happy",
            timeline: [
                { time: "2:30 PM", title: "Introduction to Programming", desc: "Basic concepts and terminology" },
                { time: "3:15 PM", title: "Variables & Data Types", desc: "Understanding different data types and variable declaration" },
                { time: "4:00 PM", title: "Control Structures", desc: "If statements and loops" },
                { time: "4:45 PM", title: "Basic Functions", desc: "Creating and using functions" }
            ]
        },
        { 
            title: "Literature Analysis", 
            date: "2023-10-19",
            time: "04:00 PM - 06:30 PM", 
            status: "Finished",
            remarks: "3.25",
            dominantExpression: "Sad",
            timeline: [
                { time: "4:00 PM", title: "Literary Elements", desc: "Understanding plot, character, and theme" },
                { time: "4:45 PM", title: "Text Analysis", desc: "Critical reading and interpretation" },
                { time: "5:30 PM", title: "Discussion", desc: "Group analysis of selected passages" },
                { time: "6:15 PM", title: "Writing Exercise", desc: "Practice writing analytical responses" }
            ]
        }
    ];


    const [, setCurrentTime] = useState(new Date());  
  
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLessonClick = (lesson: any) => {
        setSelectedLesson(lesson);
    };

    const handleBack = () => {
        setSelectedLesson(null);
    };

    return (    
        <div>
            <SidebarProvider>
                <AppSidebarStudent />
                <SidebarInset>
                    <div className="h-screen flex flex-col">
                        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb className="text-black">
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="/student">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>  
                                        <BreadcrumbSeparator className="hidden md:block" />          
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">Computer Programming</BreadcrumbLink>
                                        </BreadcrumbItem>           
                                    </BreadcrumbList>              
                                </Breadcrumb>            
                            </div>          
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <Bell className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </header>
                        <div className="flex-1 p-4 pt-0 overflow-y-auto">            
                            <div className="h-full">
                                <ExpressionCharts moods={moods} className="mb-4 sm:mb-6" />
                                
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 pb-6">
                                    {selectedLesson ? (
                                        <Card className="col-span-2 shadow-lg">
                                            <CardContent className="p-6 pb-14">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={handleBack}
                                                    >
                                                        <ArrowLeft className="h-4 w-4" />
                                                    </Button>
                                                    <h2 className="text-lg sm:text-xl font-semibold">{selectedLesson.title}</h2>
                                                </div>
                                                <div className="space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-32 px-2 sm:px-4">
                                                    {selectedLesson.timeline.map((item: any, index: number) => (
                                                        <div key={index} className="relative">
                                                            <div className="bg-black text-white px-2 py-1 rounded text-xs sm:text-sm w-fit">
                                                                {item.time}
                                                            </div>
                                                            
                                                            <div className="absolute left-12 sm:left-16 md:left-20 lg:left-24 top-0 h-full">
                                                                <div className="relative h-full">
                                                                    <div className="absolute top-3 w-2 h-2 bg-black rounded-full"></div>
                                                                    {index !== selectedLesson.timeline.length - 1 && (
                                                                        <div className="absolute top-4 left-1 w-0.5 h-[80px] sm:h-[100px] md:h-[125px] lg:h-[153px] bg-black"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="absolute left-20 sm:left-24 md:left-28 lg:left-32 top-1">
                                                                <span className="text-xs sm:text-sm font-medium">{item.title}</span>
                                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="col-span-2 shadow-lg">
                                            <CardContent className="p-3 sm:p-6">
                                                <h2 className="text-lg sm:text-xl font-semibold mb-4">Previous Lesson Schedule</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {scheduleWithExpressions.map((lesson, index) => (
                                                        <Card 
                                                            key={index} 
                                                            className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                                            onClick={() => handleLessonClick(lesson)}
                                                        >
                                                            <CardContent className="p-3 sm:p-4">
                                                                <div className="flex flex-col gap-1">
                                                                    <h3 className="font-medium text-sm sm:text-base">{lesson.title}</h3>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-xs sm:text-sm text-gray-500">Remarks: {lesson.remarks}</span>
                                                                        <span className="text-xs sm:text-sm text-gray-500">{lesson.time}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className={`text-xs sm:text-sm ${
                                                                            lesson.status === 'Finished' ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            Status: {lesson.status}
                                                                        </span>
                                                                        <span className="text-xs sm:text-sm text-gray-500">{lesson.date}</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>          
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>    
        </div>
    );
}