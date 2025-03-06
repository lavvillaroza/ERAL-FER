"use client";
import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, AlertCircle, Bell } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LessonPlan, TimelineItem } from "@/components/lesson-plan";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner";
import { getClassStudents } from "@/services/classStudentAppService";
import { useParams } from "next/navigation";
import { FERPieChart } from "@/components/fer-pie-chart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FERTimeLineChart } from "@/components/fer-timeline-chart";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student";
import FaceExpressionRecognition from "@/app/components/face-expression-recognition";
import { ExpressionCharts } from "@/components/expression-charts";

type Expression = "Happy" | "Sad" | "Angry" | "Fearful" | "Disgusted" | "Surprised" | "Neutral";

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
  const params = useParams();    
  const [classStudents, setClassStudents] = useState<ClassStudentModel[]>([]);  

  useEffect(() => {
    const fetchData = async () => {
      try {                                    
        const [resSubject, resStudents] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),
          getClassStudents(Number(params.subject_id)),          
        ])        
        setClassSubject(resSubject);  
        setClassStudents(resStudents);  
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

  const [isInSession, setIsInSession] = useState(false);

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

  const handleExpressionsDetected = (expressions: { [key: string]: number } | null) => {        
    if (expressions) {
      // Map expressions to moods and update state
        const updatedMoods = moods.map((mood) => {
            const expressionKey = mood.label.toLowerCase(); // Matching expression keys with mood labels
            const percentage = expressions[expressionKey] * 100 || 0; // Default to 0 if no match
            return {
            ...mood,
            percentage: percentage.toFixed(2), // Update the percentage to two decimal places
            };
        });

        // Update the state with the new moods array
        setMoods(updatedMoods);   
    } else {
        const updatedMoods = [
          { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50",color: "text-orange-500"},
          { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500"},
          { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500"},
          { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500"},
          { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700"},
          { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
          { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500"},
        ];
        setMoods(updatedMoods);             
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
                Leave
            </Button>           
          </div>          
          <div className="w-full">
            <div className="h-auto sm:h-[165px] mb-4">
              <ExpressionCharts moods={moods} />
            </div>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <Card className="col-span-1 shadow-lg">
                <CardContent className="flex items-center justify-center p-2 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[570px]">
                  <FaceExpressionRecognition onExpressionsDetected={handleExpressionsDetected} />                      
                </CardContent>
              </Card>              
              <LessonPlan items={timelineItems} className="col-span-1" />
            </div>
          </div>    
                              
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>    
  );
};

export default ScheduleSession;
