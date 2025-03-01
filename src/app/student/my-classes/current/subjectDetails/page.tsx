/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AppSidebarStudent } from '@/app/components/app-sidebar-student'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ExpressionCharts } from '@/components/expression-charts'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const SubjectDetails = () => {

  const [moods] = useState([
    { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
    { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
    { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
    { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
    { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
    { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" }
  ]);

  const schedules = [
    { id: 1, date: '2024-02-20', time: '10:00 AM to 11:00 AM', status: 'Finished' },
    { id: 2, date: '2024-02-22', time: '11:00 AM to 12:00 PM', status: 'Upcoming' },
    { id: 3, date: '2024-02-19', time: '11:30 AM to 12:00 PM', status: 'Canceled' },
    { id: 4, date: '2024-02-25', time: '9:00 AM to 10:00 AM', status: 'Upcoming' },
  ]

  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const scheduleWithExpressions = [
    { 
      title: "Introduction to Algebra", 
      date: "2023-10-15",
      time: "09:00 AM - 11:30 AM", 
      status: "Finished",
      remarks: "4.25",
      dominantExpression: "Happy",
      timeline: [
          { time: "9:00 AM", title: "Introduction to Numbers", desc: "Basic number theory and operations" },
          { time: "9:45 AM", title: "Variables", desc: "Understanding algebraic variables and constants" },
          { time: "10:30 AM", title: "Simple Equations", desc: "Solving basic algebraic equations" },
          { time: "11:15 AM", title: "Practice Problems", desc: "Hands-on practice with algebraic expressions" }
      ]
  },
  { 
      title: "Chemical Reactions", 
      date: "2023-10-16",
      time: "10:30 AM - 01:00 PM", 
      status: "Cancelled",
      remarks: "1.50",
      dominantExpression: "Surprised",
      timeline: [
          { time: "10:30 AM", title: "Types of Reactions", desc: "Overview of different chemical reaction types" },
          { time: "11:15 AM", title: "Balancing Equations", desc: "Learning to balance chemical equations" },
          { time: "12:00 PM", title: "Lab Safety", desc: "Safety protocols for chemical experiments" },
          { time: "12:45 PM", title: "Virtual Lab", desc: "Interactive simulation of chemical reactions" }
      ]
  },
  { 
      title: "World War II Overview", 
      date: "2023-10-17",
      time: "01:00 PM - 03:30 PM", 
      status: "Finished",
      remarks: "3.75",
      dominantExpression: "Neutral",
      timeline: [
          { time: "1:00 PM", title: "Causes of WWII", desc: "Analysis of events leading to World War II" },
          { time: "1:45 PM", title: "Major Battles", desc: "Key military campaigns and their significance" },
          { time: "2:30 PM", title: "Home Front", desc: "Civilian life during wartime" },
          { time: "3:15 PM", title: "War's End", desc: "Impact and aftermath of World War II" }
      ]
  },
  { 
      title: "Programming Basics", 
      date: "2023-10-18",
      time: "02:30 PM - 05:00 PM", 
      status: "Finished",
      remarks: "4.50",
      dominantExpression: "Happy",
      timeline: [
          { time: "2:30 PM", title: "Introduction to Programming", desc: "Basic concepts and terminology" },
          { time: "3:15 PM", title: "Variables & Data Types", desc: "Understanding different data types and variable declaration" },
          { time: "4:00 PM", title: "Control Structures", desc: "If statements and loops" },
          { time: "4:45 PM", title: "Basic Functions", desc: "Creating and using functions" }
      ]
  },
  { 
      title: "Literature Analysis", 
      date: "2023-10-19",
      time: "04:00 PM - 06:30 PM", 
      status: "Upcoming",
      remarks: "3.25",
      dominantExpression: "Sad",
      timeline: [
          { time: "4:00 PM", title: "Literary Elements", desc: "Understanding plot, character, and theme" },
          { time: "4:45 PM", title: "Text Analysis", desc: "Critical reading and interpretation" },
          { time: "5:30 PM", title: "Discussion", desc: "Group analysis of selected passages" },
          { time: "6:15 PM", title: "Writing Exercise", desc: "Practice writing analytical responses" }
      ]
  }
  ];

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  const handleBack = () => {
    setSelectedLesson(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finished':
        return 'bg-green-500'
      case 'Upcoming':
        return 'bg-blue-500'
      case 'Canceled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const sortedScheduleWithExpressions = [...scheduleWithExpressions].sort((a, b) => {
    const statusOrder = { 'Upcoming': 0, 'Finished': 1, 'Cancelled': 2 };
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
  });

  return (
    <SidebarProvider>
      <AppSidebarStudent />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/student/my-classes/current">
                    List of Subjects
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                  <BreadcrumbLink href="#">
                    Current Subject Details
                  </BreadcrumbLink>
                </BreadcrumbItem>                
              </BreadcrumbList>              
            </Breadcrumb>            
          </div>          
        </header>
        <div className="p-2 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Computer Programming 1</h1>
            </div>
          </div>

          <div className="h-auto mb-6">
            <ExpressionCharts 
              moods={moods} 
              chartSize={70}
              className="grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="w-full lg:h-[63vh]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                  Class Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[calc(63vh-120px)] pr-4">
                  <div className="grid gap-4">
                    {schedules
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((schedule) => (
                        <Card key={schedule.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <div className="font-medium">{schedule.date}</div>
                              <div className="text-sm text-gray-500">{schedule.time}</div>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(schedule.status)} text-white whitespace-nowrap`}
                            >
                              {schedule.status}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="w-full lg:h-[63vh]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  Previous Lesson Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[calc(63vh-120px)]">
                  {selectedLesson ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={handleBack}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-lg sm:text-xl font-semibold">{selectedLesson.title}</h2>
                      </div>
                      <div className="space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-32 px-2 sm:px-4">
                        {selectedLesson.timeline.map((item: any, index: number) => (
                          <div key={index} className="relative">
                            <div className="bg-black text-white px-2 py-1 rounded text-xs sm:text-sm w-fit">
                              {item.time}
                            </div>
                            
                            <div className="absolute left-12 sm:left-16 md:left-20 lg:left-24 top-0 h-full">
                              <div className="relative h-full">
                                <div className="absolute top-3 w-2 h-2 bg-black rounded-full"></div>
                                {index !== selectedLesson.timeline.length - 1 && (
                                  <div className="absolute top-4 left-1 w-0.5 h-[80px] sm:h-[100px] md:h-[125px] lg:h-[153px] bg-black"></div>
                                )}
                              </div>
                            </div>
                            
                            <div className="absolute left-20 sm:left-24 md:left-28 lg:left-32 top-1">
                              <span className="text-xs sm:text-sm font-medium">{item.title}</span>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {sortedScheduleWithExpressions.map((lesson, index) => (
                        <Card 
                          key={index} 
                          className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-sm sm:text-base">{lesson.title}</h3>
                                <span className="text-xs sm:text-sm text-gray-500">{lesson.date}</span>
                              </div>
                              <div className="flex justify-between items-center">
                              <span className={`text-xs sm:text-sm ${
                                  lesson.status === 'Finished' ? 'text-green-600' : 
                                  lesson.status === 'Upcoming' ? 'text-blue-600' : 
                                  'text-red-600'
                                }`}>
                                  {lesson.status}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500">{lesson.time}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SubjectDetails