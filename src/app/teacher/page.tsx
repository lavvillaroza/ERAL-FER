//Dashboard Defautl Page for Student
"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher"
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

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
  return (    
    <SidebarProvider>
      <AppSidebarTeacher />
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
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-6 h-6 text-gray-600" />
                </button>
              </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">            
            <div className="w-full">
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
                {moods.map((mood, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardContent className={`flex flex-col items-center justify-center p-4 rounded-[7px] ${mood.bgClass}`}>                    
                      <p className="text-lg font-semibold text-gray-800">{mood.icon} {mood.label}</p>
                      <p className="text-lg font-semibold text-gray-800">{mood.percentage} %</p>
                    </CardContent>
                  </Card>
                ))}
              </div>              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="col-span-1 shadow-lg">
                  <CardContent className="flex items-center justify-center p-2 min-h-[400px] sm:min-h-[450px] lg:min-h-[570px]">                      
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Top 10 Completed Classes</h2>
                    <div className="overflow-y-auto max-h-[350px] sm:max-h-[400px] lg:max-h-[450px]">
                      <div className="space-y-16 sm:space-y-24 lg:space-y-32 px-2 sm:px-4">                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cols-span-3 shadow-lg">
                  <CardContent className="flex items-center justify-center p-2 min-h-[400px] sm:min-h-[450px] lg:min-h-[570px]">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Top 10 Current Classes</h2>
                    <div className="overflow-y-auto max-h-[350px] sm:max-h-[400px] lg:max-h-[450px]">
                      <div className="space-y-16 sm:space-y-24 lg:space-y-32 px-2 sm:px-4">                        
                      </div>
                    </div>
                  </CardContent>
                </Card>                                
              </div>
            </div>          
        </div>
      </SidebarInset>
    </SidebarProvider>    
  );
}