"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { SubjectCard } from "@/components/subject-card-completed";
import { useEffect, useState } from "react";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { toast, Toaster } from "sonner";
import { ClassStatus } from "@/types/classStatus";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { AppSidebarStudent } from "@/components/app-sidebar-student";
import { getClassSubjectsByStudentId } from "@/services/classSubjectAppService";

export default function Page() {
  const router = useRouter();
  const [classSubjects, setClassSubjects] = useState<ClassSubjectModel[]>([]);
  const [studentUserId, setStudentUserId] = useState<number>(0);  
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchClassSubjects = async () => {                             
      try {        
          console.log(studentUserId);
          if (studentUserId === 0) return;
          const response = await getClassSubjectsByStudentId(studentUserId, ClassStatus.COMPLETED);                  
          console.log("RESPONSE:" ,response.data);
          if (response.success === true) {            
            setClassSubjects(response.data);  
          }
          else {
            toast.error("Failed to fetch class subjects!", response.message)
          }

      } catch (error) {
        console.log("Error fetching class subjects:", error);
        toast.error("Failed to fetch class subjects!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      } 
      finally {
        setIsLoading(false);
      }
    };
    fetchClassSubjects();
    // Set interval to run fetchClassSubjects every 5 seconds
    const intervalId = setInterval(fetchClassSubjects, 5000); // 5 seconds
    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(intervalId);
    
  }, [studentUserId]);
  return (
    <>
      <SidebarProvider>
        <AppSidebarStudent userId={studentUserId}/>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href='/student'>My Classes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href='/student/my-classes/completed'>Completed</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center">
              <div className="relative">
                  {/* <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                      <Bell className="w-6 h-6 text-gray-600" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                  </button> */}
              </div>
            </div>        
          </header>
            <div className="flex-1 p-2 sm:p-4 pt-0">
              {isLoading ? (
                  <Loading/>
                ) : classSubjects.length > 0 ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
                    {classSubjects.map((classSubject) => (
                      <SubjectCard key={classSubject.id} subject={classSubject} user_id={studentUserId} variant="student" />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">                      
                      <p className="text-gray-500 text-center mt-8">No available completed class.</p>
                    </div>
                  </div>    
                )}
            </div>          
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  )
}

