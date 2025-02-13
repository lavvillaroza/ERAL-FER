"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Meh, Laugh, XCircle, Book, Bell } from "lucide-react";
import { Component as PieChartComponent } from "@/components/pie-chart";
import { Component as LineGraphComponent } from "@/components/ui/line-graph";
import Image from 'next/image';
// import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"

export default function Subject() {
  const [studentToRemove, setStudentToRemove] = useState<number | null>(null);
  // Commenting out add student state and functionality
  // const [showAddDialog, setShowAddDialog] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const timelineItems = [
    { time: "8:00AM", title: "What is Java?", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    { time: "9:00AM", title: "What is Java?", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    { time: "10:00AM", title: "What is Java?", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    { time: "2:00PM", title: "What is Java?", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
    { time: "3:00PM", title: "What is Java?", desc: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." }
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
    // Add more students as needed
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
      // Update the time every second
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebarTeacher />
          
          <div className="flex-1 p-4 flex flex-col">
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
                      {/* Commenting out Add Student button
                      <Button
                        onClick={handleAddStudent}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Student
                      </Button>
                      */}
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
                  <Card className="cols-span-3 shadow-lg">
                  <CardContent className="p-4 sm:p-4 lg:p-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Lesson Plan</h2>
                    <div className="overflow-y-auto max-h-[350px] sm:max-h-[400px] lg:max-h-[270px]">
                      <div className="space-y-16 sm:space-y-24 lg:space-y-32 px-2 sm:px-4">
                        {timelineItems.map((item, index) => (
                          <div key={index} className="relative">
                            <div className="bg-black text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm w-fit">
                              {item.time}
                            </div>
                            
                            <div className="absolute left-16 sm:left-20 lg:left-24 top-0 h-full">
                              <div className="relative h-full">
                                <div className="absolute top-3 w-2 h-2 bg-black rounded-full"></div>
                                {index !== timelineItems.length - 1 && (
                                  <div className="absolute top-4 left-1 w-0.5 h-[100px] sm:h-[125px] lg:h-[153px] bg-black"></div>
                                )}
                              </div>
                            </div>
                            
                            <div className="absolute left-24 sm:left-28 lg:left-32 top-1 flex flex-col max-w-[150px] sm:max-w-[200px] lg:max-w-none">
                              <span className="text-xs sm:text-sm text-gray-600">{item.title}</span>
                              <span className="text-xs sm:text-sm text-gray-800 line-clamp-3 sm:line-clamp-4">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add this dialog component before the closing SidebarProvider */}
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

        {/* Commenting out Add Student Dialog 
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>
                Search and select a student to add to this class.
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => handleAddSelectedStudent(student.id)}
                >
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
                      <p className="text-sm text-gray-600">
                        {student.grade} - Section {student.section}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        */}
        
      </SidebarProvider>
    </div>
  );
}