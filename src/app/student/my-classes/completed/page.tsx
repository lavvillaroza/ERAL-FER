"use client";
import { AppSidebarStudent } from "@/app//components/app-sidebar-student"
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
import { useRouter } from "next/navigation"
import { SubjectCard, Subject } from "@/components/subject-card-completed"

export default function Page() {
  const subjects: Subject[] = [
    {
      id: 1,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "8:00AM - 10:00AM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "ongoing",
      roomId: "CP-101"
    },
  ];

  const router = useRouter();

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
                  <BreadcrumbPage>Completed</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-between items-center px-4 mt-4 w-full">
            <h1 className="text-2xl font-bold">Completed Subjects</h1>
          </div>
          <div className="w-[100%] px-4">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
              {subjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  variant="student"
                  onDetailsClick={() => router.push(`/student/my-classes/completed/${subject.roomId}`)}
                />
              ))}
            </div>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}