"use client"

import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner";
import { getClassStudents } from "@/services/classStudentAppService";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { getUsersDetailsByRole } from "@/services/userAppService";
import { GetFullName } from "@/lib/fullName";
import { UserRole } from "@/types/userRole";
import Loading from "@/components/loading";
import { ExpressionChartsComplete } from "@/components/expression-charts-complete";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";

const ViewStudents = () => {  
  const router = useRouter();
  const params = useParams();  
  const [classSubject, setClassSubject] = useState<ClassSubjectModel>({} as ClassSubjectModel);      
  const [classStudents, setClassstudents] = useState<ClassStudentModel[]> ([]);  
  const [isLoading, setIsLoading] = useState(true);  
  const [teacherUserId, setTeacherUserId] = useState<number>(0);

  const [moods] = useState([
    { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
    { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
    { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
    { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
    { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
    { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" },
    { icon: "😶", percentage: "0.00", label: "NA", bgClass: "bg-gray-100/50", color: "hsl(0, 0%, 50%)" },
  ]);  

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
          setTeacherUserId(refreshToken.data.id);
        }
        else {
          setTeacherUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {        
    const fetchData = async () => {
      try {                                    
        const [responseSubject, responseStudents] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),
          getClassStudents(Number(params.subject_id)),          
          getUsersDetailsByRole(UserRole.STUDENT),
        ]);
        setClassSubject(responseSubject.data);  
        setClassstudents(responseStudents.data);                         
      } catch (error) {
        console.log("Error fetching class subject:", error);
        toast.error("Failed to fetch class subject!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      }  
      finally {
        setIsLoading(false);
      }     
    }    
    fetchData();    
  }, [params.subject_id]);
  

  
  
  return (
    <SidebarProvider>
        <AppSidebarTeacher userId={teacherUserId}/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">My-Classes</BreadcrumbLink>
                                </BreadcrumbItem> 
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator> 
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/teacher/my-classes/current">
                                      Current
                                    </BreadcrumbLink>
                                </BreadcrumbItem>                                  
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>   
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={"/teacher/my-classes/current/view-students/" + classSubject.id}>
                                      View Students
                                    </BreadcrumbLink>
                                </BreadcrumbItem>         
                            </BreadcrumbList>              
                        </Breadcrumb>            
                    </div>          
                    <div className="flex items-center">
                        <div className="relative">
                            {/* <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-6 h-6 text-gray-600" />
                            </button> */}
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-2 sm:p-4 pt-0">    
                   {isLoading ? (
                              <Loading/>
                    ) :  (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                          <div>
                              <h1 className="text-xl sm:text-2xl font-bold">
                              {classSubject?.name}                
                              </h1>              
                              <pre className="mt-2 text-sm text-gray-600">{classSubject.time_schedule + " [ " + classSubject.days + " ]"}</pre>
                          </div>                                  
                      </div>
                      <div className="h-auto sm:h-[165px] mb-4">
                          <ExpressionChartsComplete moods={moods} />
                      </div>

                      <div className="flex flex-col gap-4 sm:gap-6">
                          {/* Student List Card */}
                          <Card className="w-full">
                              <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                      Student List
                                  </CardTitle>
                              </CardHeader>
                              <CardContent>                                                                
                                  <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                                      <div className="w-full overflow-auto">
                                          <Table>
                                              <TableHeader>
                                                <TableRow>
                                                    <TableHead className="whitespace-nowrap">
                                                      Name
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                      Course
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                      Dominant Expression
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                      Average
                                                    </TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {classStudents.length === 0 ? (
                                                     <TableRow>
                                                      <TableCell colSpan={4} className="text-gray-500 italic text-center py-4">
                                                        No matching students found
                                                      </TableCell>
                                                    </TableRow>                                                   
                                                ) : (
                                                    classStudents.map((student) => (
                                                      <TableRow key={student.student_details.user_id}>
                                                        <TableCell className="whitespace-nowrap">
                                                            {GetFullName(student.student_details)}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            {student.student_details.course}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            N/A
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            N/A
                                                        </TableCell>
                                                      </TableRow>
                                                  ))
                                                )}                                                
                                              </TableBody>
                                          </Table>
                                      </div>
                                  </ScrollArea>
                              </CardContent>
                          </Card>                             
                      </div>
                      
                      </>
                    )}                    
                </div>
            <Toaster />            
        </SidebarInset>
    </SidebarProvider>    
  );
};

export default ViewStudents;
