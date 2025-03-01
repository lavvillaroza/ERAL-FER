"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Meh, Laugh, XCircle, Book, Bell, HomeIcon } from "lucide-react";
import { Component as PieChartComponent } from "@/components/pie-chart";
import { Component as LineGraphComponent } from "@/components/ui/line-graph";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { LessonPlan, TimelineItem } from "@/components/lesson-plan";

export default function Subject() {
  const [studentToRemove, setStudentToRemove] = useState<number | null>(null);

  const timelineItems: TimelineItem[] = [
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
  ];

  const notifications = [
    {
      id: 1,
      title: "New assignment posted",
      time: "2 mins ago"
    },
    {
      id: 2,
      title: "Upcoming deadline",
      time: "1 hour ago"
    }
  ];

  const students = [
    { name: "John Smith", dominantMood: "Happy", moodIcon: Smile },
    { name: "Sarah Johnson", dominantMood: "Excited", moodIcon: Laugh },
    { name: "Mike Brown", dominantMood: "Neutral", moodIcon: Meh },
    { name: "John Smith", dominantMood: "Disgusted", moodIcon: Meh },
    { name: "Mike Brown", dominantMood: "Neutral", moodIcon: Meh },
    { name: "John Smith", dominantMood: "Disgusted", moodIcon: Meh },
  ];

  const handleRemoveStudent = (index: number) => {
    setStudentToRemove(index);
  };

  const confirmRemoveStudent = () => {
    if (studentToRemove !== null) {
      console.log("Removing student at index:", studentToRemove);
      setStudentToRemove(null);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebarTeacher />
          
          <div className="flex-1 p-4 flex flex-col">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/teacher" className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    Teacher
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/teacher">My Classes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/teacher/my-classes/current">Current</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Computer Programing 1</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Book size={24} className="text-black" />
                <h1 className="text-black font-semibold text-lg">Computer Programming 1</h1>
              </div>
              <p className="text-black font-semibold text-lg">Time: {currentTime.toLocaleTimeString()}</p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Subject Info and Students List */}
              <div className="flex flex-col gap-6">
                {/* Subject Information Card */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Subject Information</h2>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Teacher: John Doe</p>
                      <p className="text-sm text-gray-600">Schedule: MWF 8:00 AM - 9:30 AM</p>
                      <p className="text-sm text-gray-600">Room: Room 301</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Students List Card */}
                <Card className="shadow-lg flex-1">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Students</h2>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] space-y-3">
                      {students.map((student, index) => (
                        <Card key={index} className="shadow-lg mb-3">
                          <CardContent className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src="/images/user.png"
                                  alt={student.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>Dominant Expression:</span>
                                  <div className="flex items-center gap-1">
                                    {student.dominantMood}
                                    <student.moodIcon size={16} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStudent(index)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <XCircle size={16} />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Section - 2x2 Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-6 h-full">
                  <PieChartComponent />
                  {/* Notifications */}
                  <Card className="max-w-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium">Notifications</h2>
                        <Bell className="w-5 h-5 text-gray-500" />
                      </div>
                      
                      <div className="space-y-4">
                        {notifications.length === 0 ? (
                          <p className="text-sm text-gray-500">No new notifications</p>
                        ) : (
                          notifications.map(notification => (
                            <div key={notification.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm">{notification.title}</span>
                              <span className="text-xs text-gray-400">{notification.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Line Graph */}
                  <Card className="shadow-lg">
                    <LineGraphComponent />
                  </Card> 

                  {/* Lesson Plan */}
                  <LessonPlan items={timelineItems} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Remove Student Dialog */}
        <Dialog open={studentToRemove !== null} onOpenChange={() => setStudentToRemove(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this student? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStudentToRemove(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRemoveStudent}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </div>
  );
}