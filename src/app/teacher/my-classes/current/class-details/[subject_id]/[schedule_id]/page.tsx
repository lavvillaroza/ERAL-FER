"use client";
import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight, Bell} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CourceContents } from "@/components/course-contents";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { toast, Toaster } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClassCourseContentModel } from "@/models/classCourseContentModel";
import { getServerTime } from "@/services/timeAppService";
import { formatDate } from "@/lib/formatTime";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import { getClassScheduleById, updateClassCourseContentsStatusByScheduleIdAndId, updateClassScheduleStatus } from "@/services/classScheduleAppService";
import Loading from "@/components/loading";
import { ClassCourseContentStatus } from "@/types/classCourseContentStatus";
import { FERTimeLineChart } from "@/components/fer-timeline-chart";
import { ClassScheduleStatus } from "@/types/classScheduleStatus";
import { FERPieChart } from "@/components/fer-pie-chart";
import { ClassStudentFERAggChartModel } from "@/models/classStudentFERAggChartModel";
import { ClassStduentFERAggTimelineModel } from "@/models/classStudentFERAggTimelineModel";
import { getFERChartDataBySubjectSchedIds, getFERLast5MinutesDataBySubjectSchedIds, getFERStudentsDataBySubjectScheduleIds, getFERTimelineDataBySubjectSchedIds } from "@/services/classStudentFerAppService";
import { StudentsFERList } from "@/components/student-fer-list";
import { ClassStudentFERAggStudentModel } from "@/models/classStudentFERAggStudentModel";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { getUserThresholdByUserId } from "@/services/userAppService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserTeacherThresholdModel } from "@/models/userTeacherThresholdModel";

const ScheduleSession = () => {  
  const params = useParams();   
  const router = useRouter(); 
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
  const [classStudentFERChartData, setClassStudentFERChartData] = useState<ClassStudentFERAggChartModel>({} as ClassStudentFERAggChartModel);
  const [classStudentFERTimelineData, setClassStudentFERTimelineData] = useState<ClassStduentFERAggTimelineModel[]>([]); 
  const [classStudentFERStudentData, setclassStudentFERStudentData] = useState<ClassStudentFERAggStudentModel[]>([]);
  const [teacherUserId, setTeacherUserId] = useState<number>(0);
  const [teacherThresholds, setTeacherThresholds] = useState<UserTeacherThresholdModel[]>([]);
  const [isEndSessionDialogOpen, setIsEndSessionDialogOpen] = useState(false);    
  const [isEndSessionLoading, setIsEndSessionLoading] = useState(false);

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
          } else {
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
        console.log("teacherUserId:", teacherUserId);    
        if (teacherUserId === 0)  return;    

        const [resSubject, resUserThreshold, resSchedule] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),          
          getUserThresholdByUserId(teacherUserId),
          getClassScheduleById(Number(params.subject_id), Number(params.schedule_id)),          
        ])
        if (!resSubject.success) {
          throw new Error(resSubject.message);
        }

        if (!resUserThreshold.success) {
          throw new Error(resSchedule.message);
        }  
       
        if (!resSchedule.success) {
          throw new Error(resSchedule.message);
        }  
        setClassSubject(resSubject.data);          
        setClassSchedule(resSchedule.data);    
        setClassCourseContents(resSchedule.data.course_contents);                        
        setTeacherThresholds(resUserThreshold.data);

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
  }, [params.schedule_id, params.subject_id, teacherUserId]);

  
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

  useEffect(() => {
    const updateCourseContents = async () => {      
      const allFinished = classCourseContents.every(content => content.status === ClassCourseContentStatus.FINISHED);
      if (allFinished) {
        return;
      }
      const currentTime = serverTime.getTime();
      const scheduleEndTime = new Date(`${classSchedule.date_schedule}T${classSchedule.time_end}`).getTime();      
      const updatedContents = await Promise.all(classCourseContents.map(async (content) => {
      const contentStartTime = new Date(`${classSchedule.date_schedule}T${content.time_start}`).getTime();

      if (currentTime < contentStartTime) {                      
        const response = await updateClassCourseContentsStatusByScheduleIdAndId(ClassCourseContentStatus.UPCOMING, content.id, classSchedule.id);
        if (response.success === false) {
          toast.error("Failed to fetch class subject!", {
            description: response.message,
          });
        }          
        return { ...content, status: "upcoming" };
      } else if (currentTime >= contentStartTime && currentTime <= scheduleEndTime) {
        const response = await updateClassCourseContentsStatusByScheduleIdAndId(ClassCourseContentStatus.ONGOING, content.id, classSchedule.id);
        if (response.success === false) {
          toast.error("Failed to fetch class subject!", {
            description: response.message,
          });
        }
        return { ...content, status: "ongoing" };
      } else {
        const response = await updateClassCourseContentsStatusByScheduleIdAndId(ClassCourseContentStatus.FINISHED, content.id, classSchedule.id);
        if (response.success === false) {
          toast.error("Failed to fetch class subject!", {
            description: response.message,
          });
        }
        return { ...content, status: "finished" };
      }
      }));        
        setClassCourseContents(updatedContents);
    };
    const interval = setInterval(updateCourseContents, 1000); // Check every second
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [serverTime, classCourseContents, classSchedule.date_schedule, classSchedule.time_start, classSchedule.time_end, classSchedule.id]);

  //Get Student FER Data Per Minute 
  useEffect(() => {
    const fetchStudentFERData = async () => {
      try {
        const [responseFERTimelineData, responseFERChartData, responseFERStudentData] = await Promise.all([
          getFERTimelineDataBySubjectSchedIds(Number(params.subject_id), Number(params.schedule_id)),
          getFERChartDataBySubjectSchedIds(Number(params.subject_id), Number(params.schedule_id)),
          getFERStudentsDataBySubjectScheduleIds(Number(params.subject_id), Number(params.schedule_id))
        ]);

        if (responseFERTimelineData.success === false) {
          throw new Error(responseFERTimelineData.message);
        }
        if (responseFERChartData.success === false) {
          throw new Error(responseFERChartData.message);
        }
        if (responseFERStudentData.success === false) {
          throw new Error(responseFERStudentData.message);
        }                
                
        setClassStudentFERTimelineData(responseFERTimelineData.data);
        // ✅ Ensure responseFERChartData.data is not null or undefined
        const chartData = responseFERChartData.data || {};
        setClassStudentFERChartData({
          surprised: chartData.surprised || 0,
          happy: chartData.happy || 0,
          neutral: chartData.neutral || 0,
          sad: chartData.sad || 0,
          angry: chartData.angry || 0,
          disgusted: chartData.disgusted || 0,
          fearful: chartData.fearful || 0,
          na: chartData.na || 0,
        });        
        setclassStudentFERStudentData(responseFERStudentData.data);              
      } catch (error) {
        console.error("Error fetching student FER data:", error);
      }
    };
    const interval = setInterval(() => {      
      fetchStudentFERData();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [serverTime, params.subject_id, params.schedule_id]);

  useEffect(() => {
    if (classSchedule.status === ClassScheduleStatus.OPENED) {
      const interval = setInterval(async () => {
        const response5minutes = await getFERLast5MinutesDataBySubjectSchedIds(
          Number(params.subject_id), 
          Number(params.schedule_id)
        );
  
        if (response5minutes.success) {
          const sadThreshold = teacherThresholds.find(item => item.expression_type === "sad");
          if (response5minutes.data.sad >= (sadThreshold?.threshold ?? 50)) {
            toast("Sad Threshold Exceeded", {
              description: `Students' dominant expression is ${response5minutes.data.sad}% sadness.`,
              icon: "😢",
              duration: 5000,
              style: {
                backgroundColor: "hsl(240, 90%, 50%)",
                color: "#09090b",
              },
            });
          }
  
          const disgustedThreshold = teacherThresholds.find(item => item.expression_type === "disgusted");
          if (response5minutes.data.disgusted >= (disgustedThreshold?.threshold ?? 50)) {
            toast("Disgusted Threshold Exceeded", {
              description: `Students' dominant expression is ${response5minutes.data.disgusted}% disgusted.`,
              icon: "🤢",
              duration: 5000,
              style: {
                backgroundColor: "hsl(60, 90%, 50%)",
                color: "#09090b",
              },
            });
          }
  
          const angryThreshold = teacherThresholds.find(item => item.expression_type === "angry");
          if (response5minutes.data.angry >= (angryThreshold?.threshold ?? 50)) {
            toast("Angry Threshold Exceeded", {
              description: `Students' dominant expression is ${response5minutes.data.angry}% angry.`,
              icon: "😡",
              duration: 5000,
              style: {
                backgroundColor: "hsl(0, 90%, 50%)",
                color: "#09090b",
              },
            });
          }
  
          const fearfulThreshold = teacherThresholds.find(item => item.expression_type === "fearful");
          if (response5minutes.data.fearful >= (fearfulThreshold?.threshold ?? 50)) {
            toast("Fearful Threshold Exceeded", {
              description: `Students' dominant expression is ${response5minutes.data.fearful}% fearful.`,
              icon: "😨",
              duration: 5000,
              style: {
                backgroundColor: "hsl(280, 90%, 50%)",
                color: "#09090b",
              },
            });
          }
  
          const naThreshold = teacherThresholds.find(item => item.expression_type === "na");
          if (response5minutes.data.na >= (naThreshold?.threshold ?? 50)) {
            toast("No Face Detected Threshold Exceeded", {
              description: `${response5minutes.data.na}% of the students are not showing their faces on camera.`,
              duration: 5000,
              style: {
                backgroundColor: "hsl(0, 0%, 50%)",
                color: "#09090b",
              },
            });
          }
        }
      }, 300000); // 5 minutes interval (300,000 ms)
  
      return () => clearInterval(interval);
    }
  }, [classSchedule.status, params.subject_id, params.schedule_id, teacherThresholds]);
  
  const handleEndSession = async () => { 
    if (isEndSessionLoading) return; // Prevent duplicate requests
    
    setIsEndSessionLoading(true);
    const response = await updateClassScheduleStatus(Number(params.subject_id), Number(params.schedule_id), ClassScheduleStatus.FiNISHED)      
    if (response.success) {        
      setIsEndSessionLoading(false);
      router.push(`/teacher/my-classes/current/class-details/${classSubject.id}/${Number(params.schedule_id)}`)      
    }
    else {
      toast.error("Error!", {
        description: `${response.data.message}`,
      });
      setIsEndSessionLoading(false);
    }
  }

  return (
    <>
    <SidebarProvider>
      <AppSidebarTeacher userId={teacherUserId} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
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
                            <BreadcrumbLink href={`/teacher/my-classes/current/class-details/${params.subject_id}`}>
                              Details
                            </BreadcrumbLink>
                        </BreadcrumbItem>    
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>   
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/teacher/my-classes/current/class-details/${params.subject_id}/${params.schedule_id}`}>
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
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
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
                      onClick={() => handleEndSession()}
                      disabled={isEndSessionLoading}
                      className="w-full sm:w-auto">   
                      End Session
                  </Button>           
                </div>                          
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                  {/* Average FER Donut Chart */}
                  <FERPieChart data={classStudentFERChartData} />
                  {/* Real-time FER Chart */}
                  <FERTimeLineChart data={classStudentFERTimelineData} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">                
                    {/* Student FER Cards */}
                    <StudentsFERList students={classStudentFERStudentData} />
                    {/* Timeline-based Lesson Plan */}
                    <CourceContents className="xl:col-span-2" items={classCourseContents} />
                </div>              
              </>              
            )}                                  
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>    

    <Dialog open={isEndSessionDialogOpen} onOpenChange={setIsEndSessionDialogOpen}>          
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmation Dialog</DialogTitle>
          <DialogDescription>   
            Are you sure you want to end this subject?         
          </DialogDescription>
        </DialogHeader>                    
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
              variant="outline" 
              type="button" 
              className="w-full sm:w-auto"
              onClick={() => setIsEndSessionDialogOpen(false)}>
            no
          </Button>
          <Button type="submit" variant="default" className="w-full sm:w-auto" onClick={handleEndSession}>
            yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ScheduleSession;
