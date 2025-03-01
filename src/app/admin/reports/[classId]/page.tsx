/* eslint-disable @next/next/no-img-element */
"use client";
import { AppSidebarAdmin } from "@/app/components/app-sidebar-admin"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
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
import { useParams } from "next/navigation"

interface Student {
  id: number;
  name: string;
  image: string;
  moods: {
    icon: string;
    percentage: string;
    label: string;
    bgClass: string;
    color: string;
  }[];
}

const StudentCard = ({ student }: { student: Student }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow w-[90%]">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <img 
            src={student.image}
            alt={student.name}
            className="w-16 h-16 rounded-full mb-2"
          />
          <h3 className="font-semibold text-base mb-4">{student.name}</h3>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* First Row - 4 emotions */}
            <div className="col-span-2 grid grid-cols-4 gap-1">
              {student.moods.slice(0, 4).map((mood, index) => (
                <Card key={index} className={`${mood.bgClass} border-none`}>
                  <CardContent className="p-1.5 flex flex-col items-center">
                    <span className="text-xl mb-0.5">{mood.icon}</span>
                    <span className={`text-xs font-medium ${mood.color}`}>
                      {mood.percentage}%
                    </span>
                    <span className="text-[9px] text-gray-600">
                      {mood.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Second Row - 3 emotions */}
            <div className="col-span-2 grid grid-cols-3 gap-1">
              {student.moods.slice(4).map((mood, index) => (
                <Card key={index} className={`${mood.bgClass} border-none`}>
                  <CardContent className="p-1.5 flex flex-col items-center">
                    <span className="text-xl mb-0.5">{mood.icon}</span>
                    <span className={`text-xs font-medium ${mood.color}`}>
                      {mood.percentage}%
                    </span>
                    <span className="text-[9px] text-gray-600">
                      {mood.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const params = useParams();
  const classId = params.classId as string;

  const moods = [
    { icon: "😲", percentage: "25.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
    { icon: "😊", percentage: "15.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
    { icon: "😐", percentage: "20.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
    { icon: "😢", percentage: "10.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
    { icon: "🤢", percentage: "8.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
    { icon: "😡", percentage: "12.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "10.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" }
  ];

  // Updated students array with 15 students
  const students: Student[] = [
    {
      id: 1,
      name: "John Smith",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 2,
      name: "Emma Johnson",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 3,
      name: "Michael Brown",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 4,
      name: "Sarah Davis",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 5,
      name: "James Wilson",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 6,
      name: "Emily Taylor",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 7,
      name: "David Martinez",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 8,
      name: "Lisa Anderson",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 9,
      name: "Robert Thomas",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 10,
      name: "Jennifer Garcia",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 11,
      name: "William Lee",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 12,
      name: "Maria Rodriguez",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 13,
      name: "Daniel Kim",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 14,
      name: "Ashley White",
      image: "/images/user.png",
      moods: moods
    },
    {
      id: 15,
      name: "Kevin Chen",
      image: "/images/user.png",
      moods: moods
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebarAdmin />
      <SidebarInset>
        <header className="flex flex-col h-16 mt-4 shrink-0 items-start gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/reports">Reports</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Class {classId}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-between items-center px-4 mt-4 w-full">
            <h1 className="text-2xl font-bold">Student Expression Reports</h1>
          </div>
          <div className="w-full px-4">
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-6">
              {students.map(student => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
