"use client";
import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarDays,
  Users,
  ChevronRight,
  Plus,
  AlertCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ExpressionCharts } from "@/components/expression-charts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import LessonPlanModal from "@/components/LessonPlanModal";
import { LessonPlan, TimelineItem } from "@/components/lesson-plan";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Finished":
      return "bg-green-500";
    case "Upcoming":
      return "bg-blue-500";
    case "Canceled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const SubjectDetails = () => {
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

  const [schedules] = useState([
    {
      id: 1,
      date: "2024-02-20",
      timeRange: "10:00 AM - 11:30 AM",
      status: "Finished",
      remarks: "Introduction to Programming",
    },
    {
      id: 2,
      date: "2024-02-22",
      timeRange: "2:00 PM - 3:30 PM",
      status: "Upcoming",
      remarks: "Variables and Data Types",
    },
    {
      id: 3,
      date: "2024-02-19",
      timeRange: "11:30 AM - 1:00 PM",
      status: "Canceled",
      remarks: "Class canceled due to instructor illness",
    },
    {
      id: 4,
      date: "2024-02-25",
      timeRange: "9:00 AM - 10:30 AM",
      status: "Upcoming",
      remarks: "Control Structures",
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

  return (
    <SidebarProvider>
      <AppSidebarTeacher />
      <SidebarInset>
        <div className="p-2 sm:p-4 md:p-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/my-classes">My Classes</BreadcrumbLink>
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
                <BreadcrumbLink href="/teacher/my-classes/current/subjectDetails">
                  Computer Programming 1
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Computer Programming 1
              </h1>
            </div>
            {!isInSession ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Close Semester
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Close This Semester?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will mark the class as finished for the
                      semester. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsInSession(false)}
                className="w-full sm:w-auto"
              >
                End Session
              </Button>
            )}
          </div>

          {!isInSession ? (
            <>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-1" /> Add Class
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Class Session</DialogTitle>
                          <DialogDescription>
                            Enter the details for the new class session.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="start-time">Start Time</Label>
                              <Input id="start-time" type="time" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="end-time">End Time</Label>
                              <Input id="end-time" type="time" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select defaultValue="upcoming">
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="upcoming">
                                  Upcoming
                                </SelectItem>
                                <SelectItem value="canceled">
                                  Canceled
                                </SelectItem>
                                <SelectItem value="finished">
                                  Finished
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea
                              id="remarks"
                              placeholder="Add any additional notes"
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button type="submit" className="w-full sm:w-auto">Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                                Lesson Plan
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-center">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {schedules
                              .sort(
                                (a, b) =>
                                  new Date(b.date).getTime() -
                                  new Date(a.date).getTime()
                              )
                              .map((schedule) => (
                                <TableRow key={schedule.id}>
                                  <TableCell className="whitespace-nowrap">
                                    <div>
                                      {schedule.date}
                                      <div className="sm:hidden text-xs text-gray-500">
                                        {schedule.timeRange}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap hidden sm:table-cell">
                                    {schedule.timeRange}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="secondary"
                                      className={`${getStatusColor(
                                        schedule.status
                                      )} text-white whitespace-nowrap`}
                                    >
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
                                    {schedule.status === "Upcoming" && (
                                      <div className="flex justify-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-xs"
                                          onClick={() => setIsInSession(true)}
                                        >
                                          Open
                                        </Button>
                                        
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-xs"
                                            >
                                              Cancel
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-sm sm:max-w-md">
                                            <DialogHeader>
                                              <DialogTitle>Cancel Class Session</DialogTitle>
                                              <DialogDescription>
                                                Please provide a reason for cancelling this class.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                              <div className="grid gap-2">
                                                <Label htmlFor="cancellation-reason">Reason for Cancellation</Label>
                                                <Textarea
                                                  id="cancellation-reason"
                                                  placeholder="Please explain why you need to cancel this class session"
                                                  rows={4}
                                                />
                                              </div>
                                              <div className="grid gap-2">
                                                <Label htmlFor="notify-students">Notify Students</Label>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox id="notify-students" defaultChecked />
                                                  <label
                                                    htmlFor="notify-students"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                  >
                                                    Send notification to all students
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                              <Button variant="outline" type="button" className="w-full sm:w-auto">Cancel</Button>
                                              <Button 
                                                type="submit" 
                                                variant="destructive"
                                                className="w-full sm:w-auto"
                                                onClick={() => {
                                                  // Handle the cancellation logic here
                                                }}
                                              >
                                                Confirm Cancellation
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                        
                                        <div className="lg:hidden flex justify-center">
                                          <LessonPlanModal/>
                                        </div>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

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
                                Dominant Expression
                              </TableHead>
                              <TableHead className="whitespace-nowrap">
                                Average
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell className="whitespace-nowrap">
                                  {student.name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {student.dominantExpression}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {student.average}%
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
            </>
          ) : (
            // Online Session View
            <>
              {/* Notification */}
              {showNotification && (
                <div className="fixed top-6 right-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center z-50">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{notificationMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Average FER Donut Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Class FER</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <FERDonutChart average={currentClassAverage} />
                  </CardContent>
                </Card>

                {/* Real-time FER Chart */}
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Real-time Expression Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={ferTimeSeriesData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="happy"
                            stroke="#4ade80"
                            name="Happy"
                          />
                          <Line
                            type="monotone"
                            dataKey="neutral"
                            stroke="#60a5fa"
                            name="Neutral"
                          />
                          <Line
                            type="monotone"
                            dataKey="surprised"
                            stroke="#f97316"
                            name="Surprised"
                          />
                          <Line
                            type="monotone"
                            dataKey="sad"
                            stroke="#a855f7"
                            name="Sad"
                          />
                          <Line
                            type="monotone"
                            dataKey="disgusted"
                            stroke="#71717a"
                            name="Disgusted"
                          />
                          <Line
                            type="monotone"
                            dataKey="angry"
                            stroke="#ef4444"
                            name="Angry"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Timeline-based Lesson Plan */}
                <LessonPlan items={timelineItems} />

                {/* Student FER Cards */}
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Student Expressions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SubjectDetails;
