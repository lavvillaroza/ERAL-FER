"use client";

import { AppSidebarTeacher } from "@/app//components/app-sidebar-teacher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Page() {
  const subjects = [
    {
      id: 1,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "8:00AM - 10:00AM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "ongoing",
      teacherId: "teacher123"
    },
    {
      id: 2,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
    {
      id: 3,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
    {
      id: 4,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
    {
      id: 5,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
    {
      id: 6,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
    {
      id: 7,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
    {
      id: 8,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "10:00AM - 12:00PM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "completed",
      teacherId: "teacher123"
    },
  ];

  interface Subject {
    id: number;
    title: string;
    code: string;
    time: string;
    instructor: string;
    instructorimage: string;
    image: string;
    status: string;
    teacherId: string;
  }

  const SubjectCard = ({ subject }: { subject: Subject }) => {
    const router = useRouter();

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={subject.image}
              alt={subject.title}
              className="w-full h-48 rounded-2xl object-cover"
            />
            <button 
              onClick={() => router.push(`/teachers/${subject.teacherId}`)}
              className={`absolute top-3 right-3 ${
                subject.status === 'ongoing' ? 'bg-white' : 'bg-gray-500'
              } text-black font-bold px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-100 transition-colors`}
            >
              Join
            </button>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold mb-2">
              {subject.title} - {subject.code}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={16} className="mr-2" />
              {subject.time}
            </div>
            <div className="flex items-center mt-3">
              <img 
                src={subject.instructorimage}
                alt={subject.instructor}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-600">{subject.instructor}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebarTeacher />
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
                  <BreadcrumbPage>Completed</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4 mt-4">
            <h1 className="text-2xl font-bold"> List of Subjects </h1>
          </div>
          <div className="w-[100%] px-4">
              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
                    {subjects.map(subject => (
                     <SubjectCard key={subject.id} subject={subject} />
                  ))}
              </div>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}

