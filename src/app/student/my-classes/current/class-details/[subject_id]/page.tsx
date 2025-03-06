"use client";
import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, ChevronRight, Plus, MoreHorizontal, Bell } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExpressionCharts } from "@/components/expression-charts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import LessonPlanModal from "@/components/lesson-plan-modal";
import { TimelineItem } from "@/components/lesson-plan";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner";
import { getClassStudents } from "@/services/classStudentAppService";
import { createClassSchedule, getClassSchedules, updateClassSchedule } from "@/services/classScheduleAppService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { ClassScheduleStatus } from "@/types/classScheduleStatus";
import { format } from "date-fns";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student";

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
  const [newSchedule, setNewSchedule] = useState<ClassScheduleModel>({
    id: 0, // Assume ID is auto-generated
    class_subject_id: 0, // Passed as prop
    date_schedule: "",
    time_start: "",
    time_end: "",
    status: "upcoming", // Default value
    remarks: "",
  });
  const params = useParams();  
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);  
  const [classStudents, setClassStudents] = useState<ClassStudentModel[]>([]);
  // const [classAttendance, setClassAttendance] = useState<ClassAttendanceModel[]>([]);
  // const [classStudentsFer, setClassStudentsFer] = useState<ClassStudentFERModel[]>([]);
  // const [classLessonPlan, setClassLessonPlan] = useState<ClassLessonPlanModel[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {                                    
        const [resSubject, resStudents, resSchedules] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),
          getClassStudents(Number(params.subject_id)),
          getClassSchedules(Number(params.subject_id)),
        ])        
        setClassSubject(resSubject);  
        setClassStudents(resStudents); 
        setClassSchedules(resSchedules);  
        console.log(resStudents);
        console.log(resSchedules);      

      } catch (error) {
        console.log("Error fetching class subject:", error);
        toast.error("Failed to fetch class subject!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      } 

    }
    fetchData();
  }, [params.subject_id]);

  

  const [moods, setMoods] = useState([
    { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50",color: "text-orange-500"},
    { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500"},
    { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500"},
    { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500"},
    { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700"},
    { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500"},
  ]);    

  // Timeline-based lesson plan
  const [timelineItems] = useState<TimelineItem[]>([
    {
      time: "10:00 AM - 10:15 AM",
      title: "Introduction and Overview",
      desc: "Welcome and introduction to today's topics",
      completed: true,
      current: false,
    },
    {
      time: "10:15 AM - 10:35 AM",
      title: "Control Structures - If/Else",
      desc: "Understanding conditional logic and decision making in programming",
      completed: false,
      current: true,
    },
    {
      time: "10:35 AM - 10:55 AM",
      title: "Control Structures - Loops",
      desc: "Exploring for loops, while loops, and iterative processes",
      completed: false,
      current: false,
    },
    {
      time: "10:55 AM - 11:20 AM",
      title: "Practice Exercises",
      desc: "Hands-on exercises to implement control structures",
      completed: false,
      current: false,
    },
    {
      time: "11:20 AM - 11:30 AM",
      title: "Summary and Assignment",
      desc: "Recap of key concepts and overview of homework assignment",
      completed: false,
      current: false,
    },
  ]);

  const openScheduleSession = async (schedule_id: number) => {
    const filteredSched = classSchedules.filter(schedule => schedule.id === schedule_id);
    const currentDate = format(new Date().toLocaleDateString(), "yyyy-MM-dd");
    const schedDate = format(filteredSched[0].date_schedule, "yyyy-MM-dd");     
    if (currentDate > schedDate) {
      toast.error("Cannot connect!", {
        description: "The schedule has passed.",
      });
    }    
    else if (currentDate < schedDate) {
      toast.warning("Cannot connect!", {
        description: "The schedule is still upcoming.",
      });
    }
    else {
      const response = await updateClassSchedule(schedule_id, ClassScheduleStatus.OPENED)      
      if (response.success) {        
        router.push(`/teacher/my-classes/current/class-details/${classSubject.id}/${schedule_id}`)      
      }
      else {
        toast.error("Error!", {
          description: `${response.data.message}`,
        });
      }      
    }
  }

  const joinScheduleSession = async (schedule_id: number) => {
    router.push(`/student/my-classes/current/class-details/${classSubject.id}/${schedule_id}`)      
  }

  const statusActions = (schedule_id: number) : Record<string, JSX.Element> => ({
    upcoming: (
      <div className="flex justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                N/A
              </DropdownMenuItem>              
          </DropdownMenuContent>
        </DropdownMenu>                
        <div className="lg:hidden flex justify-center">
          <LessonPlanModal />
        </div>
      </div>
    ),
    opened: (
      <div className="flex justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">              
              <DropdownMenuItem onClick={() => joinScheduleSession(schedule_id)}>
                join
              </DropdownMenuItem>                        
          </DropdownMenuContent>
        </DropdownMenu>    
      </div>           
    ),
    finished: (
      <div className="flex justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">              
                <DropdownMenuItem onClick={() => {}}>
                  N/A
                </DropdownMenuItem>                        
            </DropdownMenuContent>
        </DropdownMenu>    
      </div>          
    ),
    cancelled: (
      <div className="flex justify-center gap-2">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">              
              <DropdownMenuItem onClick={() => {}}>
                N/A
              </DropdownMenuItem>                        
          </DropdownMenuContent>
        </DropdownMenu>  
      </div>
       
    ),
  });
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
                              {classSubject.name}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>                            
              <pre className="mt-2 text-base text-gray-600">{classSubject.time_schedule + " [ " + classSubject.days + " ]"}</pre>
            </div>            
          </div>
          <div className="h-auto sm:h-[165px] mb-4">
            <ExpressionCharts moods={moods} />
          </div>

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
                          <TableHead className="whitespace-nowrap text-center">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classSchedules
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
                                  className={`${getStatusColor(
                                    schedule.status
                                  )} text-white whitespace-nowrap`}>
                                  {schedule.status}
                                </Badge>
                                <div className="md:hidden text-xs text-gray-500 mt-1 max-w-[150px] truncate">
                                  {schedule.remarks}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate hidden md:table-cell">
                                {schedule.remarks}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="flex justify-center">
                                  <LessonPlanModal/>
                                </div>
                              </TableCell>
                              <TableCell>                                   
                                {statusActions(schedule.id)[schedule.status] || <p className="text-center text-gray-500">No actions available</p>}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>                
          </div>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>    
  );
};

export default SubjectDetails;
