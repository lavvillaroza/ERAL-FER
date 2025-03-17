//Dashboard Defautl Page for Student
"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarStudent } from "@/components/app-sidebar-student";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { TopClassesCard } from "@/components/top-classes-card";
import { useRouter } from "next/navigation";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { toast, Toaster } from "sonner"
import { ExpressionChartsDummy } from "@/components/expression-charts-dummy";
import { Badge } from "@/components/ui/badge";

export default function Page() {
    // Set initial moods state
    const [moods] = useState([
      { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
      { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
      { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
      { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
      { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
      { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
      { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" }
  ]);


  const [, setCurrentTime] = useState(new Date());  
  const router = useRouter();
  const [studentUserId, setStudentUserId] = useState<number>(0);  
  // const [classStudentFer, setClassStudentFer] = useState<ClassStudentFERModel>({
  //           id: 0, // Assuming id is auto-generated
  //           classsched_id: 0,
  //           student_user_id: 0, // Assuming student_user_id is available
  //           surprised: 0,
  //           happy: 0,
  //           neutral: 0,
  //           sad: 0,
  //           angry: 0,
  //           disgusted: 0,
  //           fearful: 0,        
  //           na: 0,
  //           datetime_stamp: new Date(),
  //     });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await getDecodedAuthToken();
        if (!token) {
          console.log("No auth token found.");
          toast.error("Failed to fetch class subjects!", {
            description: "No auth token found.",
          });
          router.push("/login");
          return; // Stop execution
        }
        const decodedToken = token.data; 
        if (!decodedToken) {
          const refreshToken = await refreshAuthToken();
          if (!refreshToken || refreshToken.success === false) {
            router.push("/login");
          }
          setStudentUserId(refreshToken.data.id);
        }
        setStudentUserId(decodedToken.id);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();    
  }, [router]);

  

  useEffect(() => {
    console.log(studentUserId);
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
    <> 
    <SidebarProvider>
      <AppSidebarStudent userId={studentUserId}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/student">
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
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                </button>
              </div>
          </div>
        </header>
        <div className="flex-1 p-2 sm:p-4 pt-0">            
            <div className="h-full flex flex-col gap-2 sm:gap-4">               
              <ExpressionChartsDummy moods={moods} /> 
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-5 flex-1">                
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
    <Toaster />
    </>
  );
}