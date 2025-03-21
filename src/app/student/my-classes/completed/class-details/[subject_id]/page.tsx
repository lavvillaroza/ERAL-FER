"use client";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, ChevronRight, } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExpressionCharts } from "@/components/expression-charts";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import { toast, Toaster } from "sonner";
import { getClassSchedules, } from "@/services/classScheduleAppService";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebarStudent } from "@/components/app-sidebar-student";
import CourseContentModal from "@/components/course-content-modal";
import Loading from "@/components/loading";
import { getFERStudentsDataBySubjectStudentUserIds } from "@/services/classStudentFerAppService";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { ClassStudentFERAggChartModel } from "@/models/classStudentFERAggChartModel";

const getStatusColor = (status: string) => {
  switch (status) {
    case "finished":
      return "bg-gray-500";
    case "upcoming":
      return "bg-blue-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "bg-green-500";
  }
};

const SubjectDetails = () => {
  const router = useRouter();
  const [classSubject, setClassSubject] = useState<ClassSubjectModel>({} as ClassSubjectModel);
  const [classSchedules, setClassSchedules] = useState<ClassScheduleModel[]>([]);
  const params = useParams();  
  const [isLoading, setIsLoading] = useState(true);
  const [classStudentFer, setClassStudentFer] = useState<ClassStudentFERAggChartModel>({} as ClassStudentFERAggChartModel);
  const [studentUserId, setStudentUserId] = useState<number>(0);  
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
    if (studentUserId === 0) return;
    const fetchData = async () => {      
      try {                                    
        const [resSubject, resFERStudentData, resSchedules] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),
          getFERStudentsDataBySubjectStudentUserIds(Number(params.subject_id), studentUserId),
          getClassSchedules(Number(params.subject_id)),
        ]);

        if (!resSubject.success) {
            throw new Error(resSubject.message);
        }

        if (!resFERStudentData.success) {
          throw new Error(resFERStudentData.message);
      }

        if (!resSchedules.success) {
          throw new Error(resSchedules.message);
      }      
        setClassSubject(resSubject.data);                  
        setClassSchedules(resSchedules.data);   
        
        if (resFERStudentData.data[0]) {
          setClassStudentFer({          
            surprised: resFERStudentData.data[0].surprised || 0,
            happy: resFERStudentData.data[0].happy || 0,
            neutral: resFERStudentData.data[0].neutral || 0,
            sad: resFERStudentData.data[0].sad || 0,
            angry: resFERStudentData.data[0].angry || 0,
            disgusted: resFERStudentData.data[0].disgusted || 0,
            fearful: resFERStudentData.data[0].fearful || 0,        
            na: resFERStudentData.data[0].na || 0,
          });
        }
        else {
          setClassStudentFer({          
            surprised: 0,
            happy: 0,
            neutral: 0,
            sad: 0,
            angry: 0,
            disgusted: 0,
            fearful: 0,        
            na: 0,
          });
        }                                
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
  }, [params.subject_id, studentUserId]); 

  return (
    <SidebarProvider>
      <AppSidebarStudent userId={studentUserId} />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">My Classes</BreadcrumbLink>
                        </BreadcrumbItem> 
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator> 
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/student/my-classes/completed">
                              Completed
                            </BreadcrumbLink>
                        </BreadcrumbItem>                          
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>   
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/student/my-classes/completed/class-details/" + classSubject.id}>
                              Details
                            </BreadcrumbLink>
                        </BreadcrumbItem>         
                    </BreadcrumbList>              
                </Breadcrumb>            
            </div>          
            <div className="flex items-center">
                <div className="relative">
                    {/* <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                        <Bell className="w-6 h-6 text-gray-600" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">4</Badge>
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
                    <h1 className="text-base sm:text-2xl font-bold">
                      {classSubject.name ?? ""}                                          
                    </h1>
                    <pre className="mt-0 text-base text-gray-600">{`[ ${classSubject.days} ] ${classSubject.time_schedule}`}</pre>
                  </div>              
                </div>
                <div className="h-auto sm:h-[165px] mb-4">
                  <ExpressionCharts studentFer={classStudentFer} />
                </div>
                <div className="flex flex-col gap-4 sm:gap-6">                                                                                            
                      <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Class Schedule Card */}
                        <Card className="w-full">
                          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl ">
                              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                              Class Schedule
                            </CardTitle>                      
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                              <div className="w-full overflow-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="whitespace-nowrap">
                                        Date
                                      </TableHead>
                                      <TableHead className="whitespace-nowrap hidden sm:table-cell">
                                        Time
                                      </TableHead>
                                      <TableHead className="whitespace-nowrap">
                                        Status
                                      </TableHead>
                                      <TableHead className="whitespace-nowrap hidden md:table-cell">
                                        Remarks
                                      </TableHead>
                                      <TableHead className="whitespace-nowrap text-center hidden lg:table-cell">
                                        Course Content
                                      </TableHead>                                      
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {classSchedules.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={6} className="text-center text-gray-500">
                                            No records available
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        classSchedules
                                          .sort(
                                            (a, b) =>
                                              new Date(b.date_schedule).getTime() -
                                              new Date(a.date_schedule).getTime()
                                          )
                                          .map((schedule) => (
                                            <TableRow key={schedule.id}>
                                              <TableCell className="whitespace-nowrap">
                                                <div>
                                                  {schedule.date_schedule}
                                                  <div className="sm:hidden text-xs text-gray-500">
                                                    {schedule.time_start + " - " + schedule.time_end}
                                                  </div>
                                                </div>
                                              </TableCell>
                                              <TableCell className="whitespace-nowrap hidden sm:table-cell">
                                                {schedule.time_start + " - " + schedule.time_end}
                                              </TableCell>
                                              <TableCell>
                                                <Badge
                                                  variant="secondary"
                                                  className={`${getStatusColor(schedule.status)} text-white whitespace-nowrap`}>
                                                  {schedule.status}
                                                </Badge>                                        
                                              </TableCell>
                                              <TableCell className="max-w-[200px] truncate hidden md:table-cell">
                                                {schedule.remarks}
                                              </TableCell>
                                              <TableCell className="hidden lg:table-cell">
                                                <div className="flex justify-center">
                                                  <CourseContentModal schedule={schedule} variant="student"/>
                                                </div>
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
                </div>
              </>     
          )} 
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>    
  );
};

export default SubjectDetails;
