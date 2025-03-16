"use client";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Bell } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CourceContents } from "@/components/course-contents";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { toast, Toaster } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student";
import { ExpressionCharts } from "@/components/expression-charts";
import { getClassScheduleById } from "@/services/classScheduleAppService";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import Loading from "@/components/loading";
import { formatDate } from "@/lib/formatTime";
import { ClassCourseContentModel } from "@/models/classCourseContentModel";
import { getServerTime } from "@/services/timeAppService";
import { ClassStudentFERModel } from "@/models/classStudentFERModel";
import { addClassStudentFERData } from "@/services/classStudentFerAppService";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { roundToTwoDecimals } from "@/lib/utils";
import dynamic from "next/dynamic";

const FacialExpressionRecognition = dynamic(() => import("@/app/components/face-expression-recognition"), { ssr: false });

const ScheduleSession = () => {
  const router = useRouter();
  const params = useParams();  
  const [studentUserId, setStudentUserId] = useState<number>(0);  
  const [classSubject, setClassSubject] = useState<ClassSubjectModel>({} as ClassSubjectModel);
  const [classSchedule, setClassSchedule] = useState<ClassScheduleModel>({
    id: 0, // Assume ID is auto-generated
    class_subject_id: 0, // Passed as prop
    date_schedule: "",
    time_start: "",
    time_end: "",
    status: "", // Default value
    topic_title: "",
    remarks: ""
  });
  const [classCourseContents, setClassCourseContents] = useState<ClassCourseContentModel[]>([]);  
  const [isLoading, setIsLoading] = useState(true);     
  const [serverTime, setServerTime] = useState(new Date());  
  //const serverTimeRef = useRef(new Date());      

  const [classStudentFer, setClassStudentFer] = useState<ClassStudentFERModel>({
        id: 0, // Assuming id is auto-generated
        classsched_id: 0,
        student_user_id: 0, // Assuming student_user_id is available
        surprised: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        angry: 0,
        disgusted: 0,
        fearful: 0,        
        na: 0,
        datetime_stamp: new Date(),
  });

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
      const fetchData = async () => {      
        try {                                    
          const [resSubject, resSchedule] = await Promise.all([
            getClassSubjectById(Number(params.subject_id)),          
            getClassScheduleById(Number(params.subject_id), Number(params.schedule_id)),
          ]);
  
          if (!resSubject.success) {
              throw new Error(resSubject.message);
          }
  
          if (!resSchedule.success) {
            throw new Error(resSchedule.message);
          }      
          setClassSubject(resSubject.data);                  
          setClassSchedule(resSchedule.data);    
          setClassCourseContents(resSchedule.data.course_contents);      
          // Check the status of the schedule and redirect if not "opened"
          if (resSchedule.data.status !== "opened") {
            toast.warning("Schedule is not opened. Redirecting...");
            router.push(`/student/my-classes/current/class-details/${params.subject_id}`);
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
    }, [params.schedule_id, params.subject_id, router]);  
  
    useEffect(() => {
      let syncInterval: NodeJS.Timeout;
      let tickInterval: NodeJS.Timeout;
    
      const fetchServerTime = async () => {
        try {
          const response = await getServerTime();
          const serverDate = new Date(response.data);
          setServerTime(serverDate);
        } catch (error) {
          console.error("Error fetching server time:", error);
        }
      };
    
      fetchServerTime(); // Initial fetch
    
      // Sync with the server every 5 minutes (300,000 ms)
      // eslint-disable-next-line prefer-const
      syncInterval = setInterval(fetchServerTime, 300000);
    
      // Increment local time every second
      // eslint-disable-next-line prefer-const
      tickInterval = setInterval(() => {
        setServerTime((prevTime) => (prevTime ? new Date(prevTime.getTime() + 1000) : new Date()));
      }, 1000);
    
      return () => {
        clearInterval(syncInterval);
        clearInterval(tickInterval);
      };
    }, []);
  
  const handleExpressionsDetected = async (expressions: { [key: string]: number } | null) => {                                 
    // Create ClassStudentFERModel
    const classStudentFERData: ClassStudentFERModel = {
      id: 0, // Assuming id is auto-generated
      classsched_id: classSchedule.id,
      student_user_id: studentUserId, // Assuming student_user_id is available
      surprised: roundToTwoDecimals(expressions?.surprised ?? 0),
      happy: roundToTwoDecimals(expressions?.happy ?? 0),
      neutral: roundToTwoDecimals(expressions?.neutral ?? 0),
      sad: roundToTwoDecimals(expressions?.sad ?? 0),
      angry: roundToTwoDecimals(expressions?.angry ?? 0),
      disgusted: roundToTwoDecimals(expressions?.disgusted ?? 0),
      fearful: roundToTwoDecimals(expressions?.fearful ?? 0),      
      na: roundToTwoDecimals(expressions?.na ?? 0),      
      datetime_stamp: new Date(),
    };

    // Update the state only if data is different
    setClassStudentFer(prevData => 
      JSON.stringify(prevData) !== JSON.stringify(classStudentFERData) ? classStudentFERData : prevData
    );

    //Uncomment if needed
    const response = await addClassStudentFERData(classSubject.id, classSchedule.id, studentUserId, classStudentFERData);
    if (!response.success) { 
      console.error("Failed to save averageFER data:", response.message);
      toast.error("Failed to save averageFER data!", {
        description: response.message,
      });        
    }
  };

  return (
    <SidebarProvider>
      <AppSidebarStudent />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="/teacher">Dashboard</BreadcrumbLink>
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
                          <BreadcrumbLink href={"/teacher/my-classes/current/class-details/" + classSubject.id}>
                            Details
                          </BreadcrumbLink>
                      </BreadcrumbItem>    
                      <BreadcrumbSeparator>
                          <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>   
                      <BreadcrumbItem>
                          <BreadcrumbLink href={`/teacher/my-classes/current/class-details/${classSubject.id}/${params.schedule_id}`}>
                            Schedule
                          </BreadcrumbLink>
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
          {isLoading ? (
              <Loading/>
            ) : (      
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                  <div>  
                    <h1 className="text-base sm:text-2xl font-bold">
                      {`${classSubject.name ?? ""} [ ${classSubject.days} ]`}
                    </h1>
                    <pre className="mt-0 text-base text-gray-600">{formatDate(classSchedule.date_schedule)} • {`${classSchedule.time_start} - ${classSchedule.time_end}`}</pre>
                    <pre className="mt-2 text-base text-black-600">Time: {serverTime.toLocaleTimeString()}</pre>
                  </div>
                  <Button
                      variant="destructive"
                      onClick={() => router.push(`/student/my-classes/current/class-details/${params.subject_id}`)}
                      className="w-full sm:w-auto">   
                      Leave
                  </Button>           
                </div>          
                <div className="w-full">
                  <div className="h-auto sm:h-[165px] mb-4">
                    <ExpressionCharts studentFer={classStudentFer} />
                  </div>            
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <Card className="col-span-1 shadow-lg">
                      <CardContent className="flex items-center justify-center p-2 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[570px]">
                        <FacialExpressionRecognition onExpressionsDetected={handleExpressionsDetected} />                      
                      </CardContent>
                    </Card>              
                    <CourceContents items={classCourseContents} className="col-span-1" />
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

export default ScheduleSession;
