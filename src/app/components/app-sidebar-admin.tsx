"use client";

import * as React from "react"
import {  
    BookCopy,  
    LayoutDashboard,
    Users, // Import User Management Icon
    FileText // Import Reports Icon
  } from "lucide-react";
import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
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
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Class Management",
      url: "/admin/class-management",
      icon: BookCopy,
      isActive: true,
      items: [],
    },
    {
        title: "User Management",
        url: "/admin/user-management",
        icon: Users,
        isActive: true,
        items: [],
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: FileText,
        isActive: true,
        items: [],
      }
  ]
}
export function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
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