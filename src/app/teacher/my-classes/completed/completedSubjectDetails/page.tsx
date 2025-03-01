/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AppSidebarTeacher } from '@/app/components/app-sidebar-teacher'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ChevronRight, 
  Printer, 
  FileText, 
  Calendar, 
  Activity, 
  Clock,
} from 'lucide-react'
import { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ExpressionCharts } from "@/components/expression-charts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FERLineChart } from '@/components/FERLineChart'
import { StudentEngagementTable } from '@/components/StudentEngagementTable'
import { LessonPlanTimeline } from '@/components/LessonPlanTimeline'


const CompletedSubjectDetails = () => {
  const [moods] = useState([
    { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
    { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
    { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
    { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
    { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
    { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" }
  ]);

  const [students] = useState([
    { id: "1", name: "Emma Wilson", dominantExpression: "Happy", average: 85 },
    { id: "2", name: "James Anderson", dominantExpression: "Neutral", average: 78 },
    { id: "3", name: "Sophia Garcia", dominantExpression: "Happy", average: 92 },
    { id: "4", name: "Lucas Martinez", dominantExpression: "Sad", average: 65 },
    { id: "5", name: "Olivia Thompson", dominantExpression: "Happy", average: 88 },
  ]);

  // Time data for the timeline with current time highlighting
  const timelineItems = [
    { time: "8:00AM", title: "What is Java?", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", completed: true },
    { time: "9:00AM", title: "Java Syntax Introduction", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", completed: true },
    { time: "10:00AM", title: "Variables and Data Types", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", completed: false, current: true },
    { time: "2:00PM", title: "Control Flow Statements", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", completed: false },
    { time: "3:00PM", title: "Functions and Methods", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", completed: false }
  ];

  // Expanded Class Schedule data to have 10+ rows for scrolling
  const classSchedule = [
    { id: 1, date: '2025-02-24', timeRange: '09:00 - 10:30', status: 'Finished', remarks: 'Chapter 5 review' },
    { id: 2, date: '2025-02-22', timeRange: '09:00 - 10:30', status: 'Finished', remarks: 'Completed all topics' },
    { id: 3, date: '2025-02-21', timeRange: '09:00 - 10:30', status: 'Cancelled', remarks: 'Teacher absence' },
    { id: 4, date: '2025-02-19', timeRange: '09:00 - 10:30', status: 'Cancelled', remarks: 'Quiz conducted' },
    { id: 5, date: '2025-02-17', timeRange: '09:00 - 10:30', status: 'Finished', remarks: 'Lab exercise' },
    { id: 6, date: '2025-02-15', timeRange: '09:00 - 10:30', status: 'Cancelled', remarks: 'Group activity' },
    { id: 7, date: '2025-02-14', timeRange: '09:00 - 10:30', status: 'Cancelled', remarks: 'Holiday' },
    { id: 8, date: '2025-02-12', timeRange: '09:00 - 10:30', status: 'Finished', remarks: 'Mid-term exam' },
    { id: 9, date: '2025-02-10', timeRange: '09:00 - 10:30', status: 'Cancelled', remarks: 'Review session' },
  ];

  // FER time series data for line chart
  const ferTimeSeriesData = [
    { time: '09:00', happy: 30, neutral: 40, surprised: 15, sad: 10, disgusted: 2, angry: 3 },
    { time: '09:15', happy: 35, neutral: 35, surprised: 20, sad: 8, disgusted: 1, angry: 1 },
    { time: '09:30', happy: 40, neutral: 30, surprised: 15, sad: 10, disgusted: 3, angry: 2 },
    { time: '09:45', happy: 25, neutral: 45, surprised: 20, sad: 5, disgusted: 2, angry: 3 },
    { time: '10:00', happy: 35, neutral: 40, surprised: 15, sad: 5, disgusted: 2, angry: 3 },
    { time: '10:15', happy: 45, neutral: 35, surprised: 10, sad: 5, disgusted: 2, angry: 3 },
  ];

  // State for selected class session (for modal)
  const [, setSelectedSession] = useState<any>(null);

  // Function to handle printing the page
  const handlePrint = () => {
    window.print();
  };

  // Status badge styling function
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Finished':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <SidebarProvider>
      <AppSidebarTeacher />
      <SidebarInset>
        {/* Main container with fixed height and overflow hidden to prevent page scrolling */}
        <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 lg:h-screen overflow-hidden flex flex-col">
          {/* Responsive Breadcrumb - improved truncation for mobile */}
          <Breadcrumb className="mb-2 sm:mb-3 md:mb-4 lg:mb-6 overflow-x-auto pb-2 flex-nowrap whitespace-nowrap">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem>
                <BreadcrumbLink href="/teacher">My Classes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/teacher/my-classes/completed">Completed</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href='/teacher/my-classes/completed/completedSubjectDetails'>
                  <span className="block truncate max-w-20 xs:max-w-32 sm:max-w-full">Computer Programming 1</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title area with better responsive behavior */}
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-4 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
            <div>
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold truncate">Computer Programming 1</h1>
            </div>
          </div>

          {/* Content area with flex-grow to fill available space */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 flex-grow flex flex-col overflow-hidden">
            {/* Expression Charts with responsive height */}
            <div className="h-auto min-h-28 xs:min-h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 mb-6 md:mb-8">
              <ExpressionCharts moods={moods} />
            </div>

            {/* Class Schedule card that grows to fill remaining space */}
            <Card className="w-full  flex flex-col overflow-hidden mt-4">
              <CardHeader className="px-3 py-2 xs:px-4 sm:px-5 sm:py-3 md:px-6 md:py-4">
                <CardTitle className="flex items-center gap-1 xs:gap-2 text-sm xs:text-base sm:text-lg md:text-xl">
                  <Calendar className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                  Previous Lesson Schedule
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">
                  Upcoming and past class sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 xs:p-1 sm:p-2 md:p-3 flex-grow overflow-hidden">
                {/* ScrollArea with dynamic height calculation for all breakpoints */}
                <ScrollArea className="h-full max-h-[calc(100vh-320px)] xs:max-h-[calc(100vh-330px)] sm:max-h-[calc(100vh-340px)] md:max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-360px)] xl:max-h-[calc(100vh-370px)] 2xl:max-h-[calc(100vh-380px)]">
                  <div className="px-2 xs:px-3 sm:px-4 md:px-2 lg:px-2">
                    <div className="w-full overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm">Date</TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm">Time Range</TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm">Status</TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm">Remarks</TableHead>
                            <TableHead className="text-right whitespace-nowrap text-xs sm:text-sm">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classSchedule.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell className="py-1 px-1 xs:py-2 xs:px-2 sm:py-2 sm:px-3 md:py-3 md:px-4 text-xs sm:text-sm">{session.date}</TableCell>
                              <TableCell className="py-1 px-1 xs:py-2 xs:px-2 sm:py-2 sm:px-3 md:py-3 md:px-4 text-xs sm:text-sm">{session.timeRange}</TableCell>
                              <TableCell className="py-1 px-1 xs:py-2 xs:px-2 sm:py-2 sm:px-3 md:py-3 md:px-4">
                                <Badge 
                                  variant={getStatusBadgeVariant(session.status)}
                                  className="text-xs font-normal py-0.5 h-4 xs:h-5 sm:h-6"
                                >
                                  {session.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-1 px-1 xs:py-2 xs:px-2 sm:py-2 sm:px-3 md:py-3 md:px-4 text-xs sm:text-sm max-w-16 xs:max-w-28 sm:max-w-36 md:max-w-44 lg:max-w-56 xl:max-w-64 truncate">
                                {session.remarks}
                              </TableCell>
                              <TableCell className="py-1 px-1 xs:py-2 xs:px-2 sm:py-2 sm:px-3 md:py-3 md:px-4 text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-6 xs:h-7 sm:h-8 md:h-9 text-xs sm:text-sm px-1 xs:px-2 sm:px-3 md:px-4"
                                      onClick={() => setSelectedSession(session)}
                                    >
                                      <span className="hidden xs:inline">View Details</span>
                                      <span className="inline xs:hidden">View</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="w-[95vw] max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] h-[90vh] p-0 gap-0 overflow-hidden">
                                    <DialogHeader className="p-3 xs:p-4 sm:p-5 md:p-6 pb-1 xs:pb-2 sm:pb-2 md:pb-2">
                                      <div className="flex items-center justify-between">
                                        <DialogTitle className="text-base xs:text-lg sm:text-xl md:text-2xl line-clamp-1">
                                          Class Session: {session?.date}
                                        </DialogTitle>
                                      </div>
                                      <div className="flex flex-wrap gap-1 xs:gap-2 sm:gap-2 md:gap-3 mt-1 xs:mt-2 sm:mt-2 md:mt-3">
                                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                          <Clock className="h-3 w-3" />
                                          {session?.timeRange}
                                        </Badge>
                                        <Badge 
                                          variant={getStatusBadgeVariant(session?.status)}
                                          className="text-xs"
                                        >
                                          {session?.status}
                                        </Badge>
                                      </div>
                                      <DialogDescription className="mt-1 xs:mt-2 text-xs sm:text-sm line-clamp-2">
                                        {session?.remarks}
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="px-3 xs:px-4 sm:px-5 md:px-6 overflow-y-auto flex-grow h-[calc(90vh-150px)] xs:h-[calc(90vh-160px)] sm:h-[calc(90vh-170px)] md:h-[calc(90vh-180px)]">
                                      <Tabs defaultValue="analytics" className="w-full">
                                        <TabsList className="w-full grid grid-cols-3 h-8 xs:h-9 sm:h-10 md:h-11">
                                          <TabsTrigger value="analytics" className="text-xs sm:text-sm md:text-base">Analytics</TabsTrigger>
                                          <TabsTrigger value="students" className="text-xs sm:text-sm md:text-base">Students</TabsTrigger>
                                          <TabsTrigger value="lesson" className="text-xs sm:text-sm md:text-base">Lesson Plan</TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="analytics" className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 mt-3 xs:mt-4 sm:mt-4 md:mt-6 data-[state=inactive]:hidden">
                                          {/* Real-time FER Line Chart */}
                                          <Card>
                                            <CardHeader className="p-2 xs:p-3 sm:p-4 md:p-5 pb-1 xs:pb-1 sm:pb-2 md:pb-2">
                                              <CardTitle className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">Real-time FER Analysis</CardTitle>
                                              <CardDescription className="text-xs sm:text-sm md:text-base">
                                                Tracking emotional expressions throughout the class session
                                              </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5">
                                              <div className="h-36 xs:h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
                                                <FERLineChart ferTimeSeriesData={ferTimeSeriesData as unknown as { timestamp: string; value: number }[]} />
                                              </div>
                                            </CardContent>
                                          </Card>
                                          
                                          {/* Improved Session Emotional Analysis */}
                                          <Card className="mb-2 xs:mb-3 sm:mb-4 md:mb-6">
                                            <CardHeader className="p-2 xs:p-3 sm:p-4 md:p-5 pb-1 xs:pb-1 sm:pb-2 md:pb-2">
                                              <CardTitle className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
                                                <Activity className="h-3 w-3 xs:h-4 xs:w-4" />
                                                Overall Facial Emotion Recognition (FER)
                                              </CardTitle>
                                              <CardDescription className="text-xs sm:text-sm md:text-base">
                                                Average emotional expressions across all students in this class
                                              </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5">
                                              <div className="h-20 xs:h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44">
                                                <ExpressionCharts moods={moods} />
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                        
                                        <TabsContent value="students" className="mt-3 xs:mt-4 sm:mt-4 md:mt-6 data-[state=inactive]:hidden">
                                          <Card>
                                            <CardHeader className="p-2 xs:p-3 sm:p-4 md:p-5 pb-1 xs:pb-1 sm:pb-2 md:pb-2">
                                              <CardTitle className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
                                                <Users className="h-3 w-3 xs:h-4 xs:w-4" />
                                                Student Engagement
                                              </CardTitle>
                                              <CardDescription className="text-xs sm:text-sm md:text-base">
                                                Real-time FER of students present in this session
                                              </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5">
                                              <div className="overflow-x-auto">
                                                <StudentEngagementTable students={students} />
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                        
                                        {/* Improved Lesson Plan Tab */}
                                        <TabsContent value="lesson" className="mt-3 xs:mt-4 sm:mt-4 md:mt-6 data-[state=inactive]:hidden">
                                          <Card>
                                            <CardHeader className="p-2 xs:p-3 sm:p-4 md:p-5 pb-1 xs:pb-1 sm:pb-2 md:pb-2">
                                              <CardTitle className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl flex items-center gap-1 xs:gap-2">
                                                <FileText className="h-3 w-3 xs:h-4 xs:w-4" />
                                                Lesson Progress
                                              </CardTitle>
                                              <CardDescription className="text-xs sm:text-sm md:text-base">
                                                Topic progression with timing during this session
                                              </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5">
                                              <LessonPlanTimeline timelineItems={timelineItems} />
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                      </Tabs>
                                    </div>
                                    
                                    <DialogFooter className="px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-3 sm:py-4 md:py-5 border-t flex-shrink-0 sticky bottom-0 bg-white dark:bg-gray-950 z-10">
                                      <div className="flex w-full justify-between sm:justify-end gap-1 xs:gap-2 sm:gap-3 md:gap-4">
                                        <Button 
                                          variant="outline" 
                                          onClick={handlePrint} 
                                          className="flex-1 sm:flex-initial items-center gap-1 xs:gap-2 text-xs sm:text-sm h-7 xs:h-8 sm:h-9 md:h-10"
                                        >
                                          <Printer className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                                          <span className="hidden xs:inline">Print Details</span>
                                          <span className="inline xs:hidden">Print</span>
                                        </Button>
                                        <DialogClose asChild>
                                          <Button className="flex-1 sm:flex-initial text-xs sm:text-sm h-7 xs:h-8 sm:h-9 md:h-10">Close</Button>
                                        </DialogClose>
                                      </div>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CompletedSubjectDetails;