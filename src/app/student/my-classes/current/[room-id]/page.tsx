'use client'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Book } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { LessonPlan, TimelineItem } from "@/components/lesson-plan";

// Dynamically import the FaceExpressionRecognition component with no SSR
const FaceExpressionRecognition = dynamic(
  () => import('@/app/components/face-expression-recognition'),
  { ssr: false } // This ensures the component only loads on client side
);

export default function Page() {
    // Set initial moods state
    const [moods, setMoods] = useState([
        { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50" },
        { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50" },
        { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50" },
        { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50" },
        { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50" },
        { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50" },
        { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50" }
    ]);
    
    const timelineItems: TimelineItem[] = [
      {
        time: "10:00 AM - 10:15 AM",
        title: "Introduction and Overview",
        desc: "Welcome and introduction to today's topics",
        completed: true,
        current: false,
      },
      {
        time: "10:15 AM - 10:35 AM",
        title: "Control Structures - If/Else",
        desc: "Understanding conditional logic and decision making in programming",
        completed: false,
        current: true,
      },
      {
        time: "10:35 AM - 10:55 AM",
        title: "Control Structures - Loops",
        desc: "Exploring for loops, while loops, and iterative processes",
        completed: false,
        current: false,
      },
      {
        time: "10:55 AM - 11:20 AM",
        title: "Practice Exercises",
        desc: "Hands-on exercises to implement control structures",
        completed: false,
        current: false,
      },
      {
        time: "11:20 AM - 11:30 AM",
        title: "Summary and Assignment",
        desc: "Recap of key concepts and overview of homework assignment",
        completed: false,
        current: false,
      },
    ];

    const handleExpressionsDetected = (expressions: { [key: string]: number } | null) => {        
        if (expressions) {
          // Map expressions to moods and update state
            const updatedMoods = moods.map((mood) => {
                const expressionKey = mood.label.toLowerCase(); // Matching expression keys with mood labels
                const percentage = expressions[expressionKey] * 100 || 0; // Default to 0 if no match

                return {
                ...mood,
                percentage: percentage.toFixed(2), // Update the percentage to two decimal places
                };
            });

            // Update the state with the new moods array
            setMoods(updatedMoods);   
        } else {
            const updatedMoods = [
                { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50" },
                { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50" },
                { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50" },
                { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50" },
                { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50" },
                { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50" },
                { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50" }
            ];
            setMoods(updatedMoods);             
        }
      };

  const [currentTime, setCurrentTime] = useState(new Date());  
  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (    
    <SidebarProvider>
      <AppSidebarStudent />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="horizontal" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/student/my-classes/current">
                    List of Subjects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    Current Subject Details
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>              
            </Breadcrumb>            
          </div>          
            {/* Right Side: Icons and Profile Picture */}
          <div className="flex items-center space-x-4">
             {/* Notification Bell with Counter */}
              <div className="relative">
                {/* Bell Icon */}
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-6 h-6 text-gray-600" />
                </button>
              </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Book size={24} className="text-black" />
                    <h1 className="text-black font-semibold text-lg">Computer Programming 1</h1>
                </div>             
                <p className="text-black font-semibold text-lg">Time: {currentTime.toLocaleTimeString()}</p>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {moods.map((mood, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardContent className={`flex flex-col items-center justify-center p-2 sm:p-4 rounded-[7px] ${mood.bgClass}`}>                    
                      <p className="text-base sm:text-lg font-semibold text-gray-800">{mood.icon} {mood.label}</p>
                      <p className="text-base sm:text-lg font-semibold text-gray-800">{mood.percentage} %</p>
                    </CardContent>
                  </Card>
                ))}
              </div>              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <Card className="col-span-1 shadow-lg">
                  <CardContent className="flex items-center justify-center p-2 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[570px]">
                    <FaceExpressionRecognition onExpressionsDetected={handleExpressionsDetected} />                      
                  </CardContent>
                </Card>
                
                <LessonPlan items={timelineItems} className="col-span-1" />
              </div>
            </div>          
        </div>
      </SidebarInset>
    </SidebarProvider>    
  );
}