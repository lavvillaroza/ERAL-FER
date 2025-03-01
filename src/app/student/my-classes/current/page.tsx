/* eslint-disable prefer-const */
"use client";
import { AppSidebarStudent } from "@/app/components/app-sidebar-student"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SubjectCard, Subject } from "@/components/subject-card-current"

export default function Page() {

  const subjects: Subject[] = [
    {
      id: 1,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "9:00PM - 11:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "ongoing",
      classId: "D-CP-101",
      isScheduled: true
    },
    {
      id: 2,
      title: "Computer Programming 2",
      code: "CRP-2002025",
      time: "10:00AM - 12:00PM",
      instructor: "Jane Smith",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "ongoing",
      classId: "D-CP-102",
      isScheduled: false
    },
    {
      id: 3,
      title: "Computer Programming 3",
      code: "CRP-2002026",
      time: "12:00PM - 2:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "ongoing",
      classId: "D-CP-103",
      isScheduled: true
    },
  ];

  // Convert time string to minutes for comparison
  const timeToMinutes = (time: string) => {
    const [hourStr, minuteStr] = time.split(':');
    let [hours, minutes] = [parseInt(hourStr), parseInt(minuteStr)];
    const isPM = time.includes('PM');
    
    if (isPM && hours !== 12) { 
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Sort subjects by time
  const sortedSubjects = [...subjects].sort((a, b) => {
    const timeA = timeToMinutes(a.time.split(' - ')[0]);
    const timeB = timeToMinutes(b.time.split(' - ')[0]);
    return timeA - timeB;
  });

  return (
    <SidebarProvider>
      <AppSidebarStudent />
      <SidebarInset>
        <header className="flex flex-col h-16 mt-4 shrink-0 items-start gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>My Classes</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Current</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-between items-center px-4 mt-4 w-full">
            <h1 className="text-2xl font-bold">List of Subjects</h1>
          </div>
          <div className="w-[100%] px-4">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
              {sortedSubjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} variant="student" />
              ))}
            </div>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}