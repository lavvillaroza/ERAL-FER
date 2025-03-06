"use client";
import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronRight, AlertCircle, Bell } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LessonPlan, TimelineItem } from "@/components/lesson-plan";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner";
import { getClassStudents } from "@/services/classStudentAppService";
import { createClassSchedule, getClassSchedules } from "@/services/classScheduleAppService";
import { useParams } from "next/navigation";
import { FERPieChart } from "@/components/fer-pie-chart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FERTimeLineChart } from "@/components/fer-timeline-chart";
import Subject from "../../../[room-id]/page";

type Expression = "Happy" | "Sad" | "Angry" | "Fearful" | "Disgusted" | "Surprised" | "Neutral";

// Mock component for donut chart
const FERDonutChart = ({ average }: { average: number }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="relative h-36 w-36 flex items-center justify-center bg-blue-100 rounded-full">
      <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
        <span className="text-2xl font-bold">{average}%</span>
      </div>
    </div>
    <p className="mt-2 text-center font-medium">Average FER</p>
  </div>
);

// Mock component for live student FER cards
const StudentFERCard = ({ student }: { student: { name: string; dominantExpression: Expression; average: number } }) => (
  <Card className="w-full">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{student.name}</h3>
          <p
            className={`text-sm ${getExpressionColor(
              student.dominantExpression
            )}`}
          >
            {student.dominantExpression}
          </p>
        </div>
        <div className="text-xl font-bold">{student.average}%</div>
      </div>
    </CardContent>
  </Card>
);

const getExpressionColor = (expression: Expression) => {
  switch (expression) {
    case "Happy":
      return "text-green-500";
    case "Sad":
      return "text-purple-500";
    case "Angry":
      return "text-red-500";
    case "Fearful":
      return "text-slate-500";
    case "Disgusted":
      return "text-zinc-700";
    case "Surprised":
      return "text-orange-500";
    default:
      return "text-blue-500"; // Neutral
  }
};

const ScheduleSession = () => {
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
    {
      icon: "😲",
      percentage: "25.00",
      label: "Surprised",
      bgClass: "bg-gray-100/50",
      color: "text-orange-500",
    },
    {
      icon: "😊",
      percentage: "15.00",
      label: "Happy",
      bgClass: "bg-gray-100/50",
      color: "text-green-500",
    },
    {
      icon: "😐",
      percentage: "20.00",
      label: "Neutral",
      bgClass: "bg-gray-100/50",
      color: "text-blue-500",
    },
    {
      icon: "😢",
      percentage: "10.00",
      label: "Sad",
      bgClass: "bg-gray-100/50",
      color: "text-purple-500",
    },
    {
      icon: "🤢",
      percentage: "8.00",
      label: "Disgusted",
      bgClass: "bg-gray-100/50",
      color: "text-zinc-700",
    },
    {
      icon: "😡",
      percentage: "12.00",
      label: "Angry",
      bgClass: "bg-gray-100/50",
      color: "text-red-500",
    },
    {
      icon: "😨",
      percentage: "10.00",
      label: "Fearful",
      bgClass: "bg-gray-100/50",
      color: "text-slate-500",
    },
  ]);

  const ferTimeSeriesData = [
    {
      time: "09:00",
      happy: 30,
      neutral: 40,
      surprised: 15,
      sad: 10,
      disgusted: 2,
      angry: 3,
    },
    {
      time: "09:15",
      happy: 35,
      neutral: 35,
      surprised: 20,
      sad: 8,
      disgusted: 1,
      angry: 1,
    },
    {
      time: "09:30",
      happy: 40,
      neutral: 30,
      surprised: 15,
      sad: 10,
      disgusted: 3,
      angry: 2,
    },
    {
      time: "09:45",
      happy: 25,
      neutral: 45,
      surprised: 20,
      sad: 5,
      disgusted: 2,
      angry: 3,
    },
    {
      time: "10:00",
      happy: 35,
      neutral: 40,
      surprised: 15,
      sad: 5,
      disgusted: 2,
      angry: 3,
    },
    {
      time: "10:15",
      happy: 45,
      neutral: 35,
      surprised: 10,
      sad: 5,
      disgusted: 2,
      angry: 3,
    },
  ];

  const [students] = useState([
    { id: 1, name: "Emma Wilson", dominantExpression: "Happy", average: 85 },
    {
      id: 2,
      name: "James Anderson",
      dominantExpression: "Neutral",
      average: 78,
    },
    { id: 3, name: "Sophia Garcia", dominantExpression: "Happy", average: 92 },
    { id: 4, name: "Lucas Martinez", dominantExpression: "Sad", average: 65 },
    {
      id: 5,
      name: "Olivia Thompson",
      dominantExpression: "Happy",
      average: 88,
    },
  ]);

  const [isInSession, setIsInSession] = useState(false);
  const [currentClassAverage] = useState(78);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

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

  // Simulate FER updates every 3 seconds
  useEffect(() => {
    if (isInSession) {
      const interval = setInterval(() => {
        // Update moods with slight variations
        setMoods((prev) =>
          prev.map((mood) => ({
            ...mood,
            percentage: (
              parseFloat(mood.percentage) +
              (Math.random() * 2 - 1)
            ).toFixed(2),
          }))
        );

        // Check for threshold notifications (example: if Sad or Angry > 15%)
        const sadPercentage = parseFloat(
          moods.find((m) => m.label === "Sad")?.percentage || "0"
        );
        const angryPercentage = parseFloat(
          moods.find((m) => m.label === "Angry")?.percentage || "0"
        );

        if (sadPercentage > 15 || angryPercentage > 15) {
          setShowNotification(true);
          setNotificationMessage(
            `Alert: ${
              sadPercentage > 15 ? "Sad" : "Angry"
            } expression threshold exceeded!`
          );

          // Auto-dismiss notification after 3 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isInSession, moods]);

  const [currentTime, setCurrentTime] = useState(new Date());  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  return (
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>              
              <pre className="mt-2 text-base text-black-600">Time: {currentTime.toLocaleTimeString()}</pre>
            </div>
            <Button
                variant="destructive"
                onClick={() => setIsInSession(false)}
                className="w-full sm:w-auto">   
                End Session
            </Button>           
          </div>          
            {/* Notification */}
            {showNotification && (
            <div className="fixed top-6 right-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center z-50">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{notificationMessage}</p>
            </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Average FER Donut Chart */}
                <FERPieChart />

                {/* Real-time FER Chart */}
                <FERTimeLineChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">                
                {/* Student FER Cards */}
                <Card >
                    <CardHeader>
                    <CardTitle className="text-lg">
                        Student Expressions
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="grid grid-cols-1 gap-4">
                        {students.map((student) => (
                            <StudentFERCard 
                            key={student.id} 
                            student={{
                                name: student.name,
                                dominantExpression: student.dominantExpression as Expression,
                                average: student.average
                            }} 
                            />
                        ))}
                        </div>
                    </ScrollArea>
                    </CardContent>
                </Card>
                {/* Timeline-based Lesson Plan */}
                <LessonPlan className="xl:col-span-2" items={timelineItems} />
            </div>                      
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>    
  );
};

export default ScheduleSession;
