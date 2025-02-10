"use client";

import * as React from "react"
import {
  BookOpen,
  BookCopy ,
  LifeBuoy,    
  Send,  
  LayoutDashboard ,
  School
} from "lucide-react"
import { NavMain } from "@/app/student/components/nav-main"
import { NavUser } from "@/app/student/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Classes",
      url: "#",
      icon: School,
      items: [
        {
          title: "Completed",
          url: "/student/classes/completed",
        },
        {
          title: "On-Going",
          url: "/student/classes/on-going",
        }
      ],
    },
    {
      title: "Performance",
      url: "#",
      icon: BookOpen,
      items: [        
      ],
    }
  ]
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookCopy className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ERAL</span>
                  <span className="truncate text-xs">utilizing FER</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />             
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}