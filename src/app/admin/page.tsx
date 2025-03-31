'use client'

import React, { useEffect, useState } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TopClassesCard } from "@/components/top-classes-card";
import { toast, Toaster } from "sonner"
import { useRouter } from 'next/navigation';
import { getDecodedAuthToken, refreshAuthToken } from '@/services/authAppService';
import { UserPieChart } from '@/components/users-chart';
import { UserStatusPieChart } from '@/components/user-status-chart';
import { SubjectsPieChart } from '@/components/subject-chart';
import { getTopClassSubjects } from '@/services/classSubjectAppService';
import { getNewAccountNotifications } from '@/services/notificationsAppService';

interface UserNotification {
  id: number;
  name: string;
  role: string;
  time: string;
}

export default function Page() {  
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [topClasses, setTopClasses] = useState([]);
  const router = useRouter(); 
  const [userId, setUserId] = useState<number>(0);  
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
          setUserId(refreshToken.data.id);
        } else {
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);
  
  useEffect(() => {        
      const fetchTopSubjectWithFER = async () => {
        try {         
          const response = await getTopClassSubjects();
          if (!response.success) {
            throw new Error(response.message);
          }      
          const result = response.data; // Assuming API returns an array of users
          console.log(result);
          // Format the results into the required structure
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData = result.map((row: { id: number; name: string; students: number; happy: number; surprised: number; neutral: number; }) => ({
            id: row.id,
            name: row.name,
            students: Number(row.students),
            emotions: {
              happy: row.happy,
              surprised: row.surprised,
              neutral: row.neutral
            }
          }));
          setTopClasses(formattedData);

        } catch (error) {
          console.log("Error fetching class subject:", error);
          toast.error("Failed to fetch class subject!", {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          });
        }          
      }
  
      fetchTopSubjectWithFER();    
    }, []);  


    useEffect(() => {        
      const fetchNewAccountRegistered = async () => {
        try {         
          const response = await getNewAccountNotifications();
          if (!response.success) {
            throw new Error(response.message);
          }      
          const result = response.data; // Assuming API returns an array of users
          if (result.success == false) {
            throw new Error(result.message);
          }          
          setNotifications(result);
        } catch (error) {
          console.log("Error fetching new registered accounts:", error);
          toast.error("Failed to fetch new registered accounts!", {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          });
        }          
      }
  
      fetchNewAccountRegistered();    
    }, []);  

    function getTimeAgo(timestamp: string | Date): string {
      const now = new Date();
      const time = new Date(timestamp);
      const diffMs = now.getTime() - time.getTime(); // Difference in milliseconds
      const diffMinutes = Math.floor(diffMs / 60000); // Convert to minutes
    
      if (diffMinutes < 1) return "Now";
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
      const diffWeeks = Math.floor(diffDays / 7);
      if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    }
    
  // Rest of the component remains the same until the topClasses mapping
  return (    
    <SidebarProvider>
      <AppSidebarAdmin userId={userId} />
      <SidebarInset>
        {/* Header section remains the same */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>                
              </BreadcrumbList>              
            </Breadcrumb>            
          </div>          
          <div className="flex items-center space-x-4 px-4">
            <div className="relative">
              {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
              </button> */}
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">            
          <div className="w-full">

            <div className={`grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 mb-4`}>
              <UserPieChart/>
              <UserStatusPieChart/>
              <SubjectsPieChart/>
            </div>                        
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                 {/* For Notifications Card */}
                 <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">                      
                    <h2 className="text-xl font-semibold mb-4">New Account Notifications</h2>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {notifications.length !== 0 &&  notifications.map((notification) => (
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
                                </div>
                                <span className="text-sm text-gray-500 ml-4">{getTimeAgo(notification.time)}</span>
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
        <Toaster />
      </SidebarInset>
    </SidebarProvider>    
  );
}
