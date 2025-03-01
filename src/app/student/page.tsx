//Dashboard Defautl Page for Student
"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { TopClassesCard } from "@/components/top-classes-card";

export default function Page() {
    // Set initial moods state
    const [moods, ] = useState([
        { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50" },
        { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50" },
        { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50" },
        { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50" },
        { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50" },
        { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50" },
        { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50" }
    ]);

  const [, setCurrentTime] = useState(new Date());  

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Add new state for completed and current classes
  const [completedClasses] = useState([
    { 
      id: 1, 
      name: "Introduction to Psychology",
      students: 35,
      emotions: {
        happy: 40,
        surprised: 25,
        neutral: 20
      }
    },
    { 
      id: 2, 
      name: "World History 101",
      students: 42,
      emotions: {
        happy: 35,
        surprised: 30,
        neutral: 25
      }
    },
    { 
      id: 3, 
      name: "Computer Programming",
      students: 22,
      emotions: {
        happy: 60,
        surprised: 40,
        neutral: 27
      }
    },
    { 
      id: 4, 
      name: "Entrepreneurship",
      students: 85,
      emotions: {
        happy: 56,
        surprised: 32,
        neutral: 30
      }
    },
    // Add more completed classes...
  ]);

  const [currentClasses] = useState([
    { 
      id: 1, 
      name: "Advanced Mathematics",
      students: 38,
      emotions: {
        happy: 32,
        surprised: 28,
        neutral: 30
      }
    },
    { 
      id: 2, 
      name: "English Literature",
      students: 45,
      emotions: {
        happy: 38,
        surprised: 22,
        neutral: 25
      }
    },
    // Add more current classes...
  ]);

  return (    
    <SidebarProvider>
      <AppSidebarStudent />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
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
                <button aria-label='botton' className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-6 h-6 text-gray-600" />
                </button>
              </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">            
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {moods.map((mood, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className={`flex flex-col items-center justify-center h-full p-2 sm:p-4 ${mood.bgClass}`}>                    
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xl sm:text-2xl">{mood.icon}</span>
                        <span className="text-sm sm:text-lg font-semibold text-gray-800">{mood.label}</span>
                      </div>
                      <p className="text-sm sm:text-lg font-semibold text-gray-800">{mood.percentage}%</p>
                    </CardContent>
                  </Card>
                ))}
              </div>              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
                <TopClassesCard 
                  title="Top Completed Classes with Positive Expressions"
                  classes={completedClasses}
                  schedule="Schedule: Mon/Wed/Fri 10:00 AM to 12:00 PM"
                />
                <TopClassesCard 
                  title="Top Current Classes with Positive Expressions"
                  classes={currentClasses}
                  schedule="Schedule: Tue/Thu 2:00 PM to 4:00 PM"
                />
              </div>
            </div>          
        </div>
      </SidebarInset>
    </SidebarProvider>    
  );
}