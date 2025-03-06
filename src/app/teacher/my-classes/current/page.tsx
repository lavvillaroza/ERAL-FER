"use client";

import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { SubjectCard } from "@/components/subject-card-current"
import { getUserIdFromToken } from "@/lib/jwt";
import { getClassSubjectsByTeacherId } from "@/services/classSubjectAppService";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { toast, Toaster } from "sonner"
import { getAuthToken } from "@/services/authAppService";
import { Bell } from "lucide-react";

export default function Page() {
  const [classSubjects, setClassSubjects] = useState<ClassSubjectModel[]>([]);
  const [teacherUserId, setTeacherUserId] = useState<number>(0);

  useEffect(() => {
      const fetchClassSubjects = async () => {
      const authToken = await getAuthToken();                 
      if (!authToken) {
        console.log("No auth token found.");
        toast.error("Failed to fetch class subjects!", {
          description: "No auth token found.",
        });
        return;
      }      
      
    // const secretKey = await getSecretKey();
    // if (!secretKey) {
    //   console.log("No secret key found.");
    //   toast.error("Failed to fetch class subjects!", {
    //     description: "No secret key found.",
    //   });
    //   return;
    // }     

      try {        
        const user_id = getUserIdFromToken(authToken.auth_token); // Extract user_id        
        if (!user_id) {
          console.log("Failed to extract user ID from token.");
          toast.error("Failed to fetch class subjects!", {
            description: "No teacher user id found.",
          });
          return;
        }
        
        setTeacherUserId(user_id?.id);
        
        const response = await getClassSubjectsByTeacherId(user_id?.id);        

        setClassSubjects(response);  
      } catch (error) {
        console.log("Error fetching class subjects:", error);
        toast.error("Failed to fetch class subjects!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      } 
    };
    fetchClassSubjects();
  }, []);

  return (
    <>
    <SidebarProvider>
      <AppSidebarTeacher />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href='/teacher'>My Classes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href='/teacher/my-classes/current'>Current</BreadcrumbLink>
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
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
            {classSubjects.map((classSubject) => (
              <SubjectCard 
                key={classSubject.id} 
                subject={classSubject} 
                user_id={teacherUserId}
                variant="teacher"
                onViewStudents={() => {
                  // Handle view students logic here
                }}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    <Toaster />
    </>
  );
}