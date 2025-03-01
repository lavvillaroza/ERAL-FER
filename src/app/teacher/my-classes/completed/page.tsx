"use client";
import { AppSidebarTeacher } from "@/app//components/app-sidebar-teacher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { SubjectCard } from "@/components/subject-card-completed";

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
  ];

  const router = useRouter();

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
                  <BreadcrumbLink href='/teacher'>My Classes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href='/teacher/my-classes/completed'>Completed</BreadcrumbLink>
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
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  variant="teacher"
                  onDetailsClick={() => router.push(`/teacher/my-classes/completed/completedSubjectDetails`)}
                />
              ))}
            </div>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}

